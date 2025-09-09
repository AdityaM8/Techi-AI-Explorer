import { prisma } from './prisma'
import { embedText, ensurePgVector } from './embeddings'

export async function getRecommendations(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) throw new Error('Task not found')

  await ensurePgVector()
  const vec = await embedText(task.description)
  const arr = 'ARRAY[' + vec.map(v => Number(v.toFixed(6))).join(',') + ']'
  // Use pgvector <=> cosine distance for nearest tools
  const rows = await prisma.$queryRawUnsafe<any[]>(`
    SELECT id, name, siteUrl, category, supportsEmbed, embedType, authType, capabilities, calledPromptTemplate,
           1 - (embedding <=> ${arr}::vector(1536)) as score
    FROM "Tool"
    WHERE isFree = true AND embedding IS NOT NULL
    ORDER BY embedding <=> ${arr}::vector(1536)
    LIMIT 5
  `)
  // If no embeddings yet, fall back to simple listing
  if (!rows.length) {
    const tools = await prisma.tool.findMany({ where: { isFree: true }, take: 5 })
    return tools.map((t, i) => ({
      rank: i+1,
      score: 0.0,
      rationale: 'No embeddings yet; showing default free tools. Use admin to compute embeddings.',
      tool: t
    }))
  }
  return rows.map((t, i) => ({
    rank: i+1,
    score: Number(t.score),
    rationale: t.supportsEmbed ? 'Embeds inside AI Explorer (vector-ranked).' : 'Opens externally (vector-ranked).',
    tool: {
      id: t.id, name: t.name, siteUrl: t.siteUrl, category: t.category, supportsEmbed: t.supportsEmbed,
      embedType: t.embedType, authType: t.authType, isFree: true,
      capabilities: JSON.parse(t.capabilities), calledPromptTemplate: t.calledPromptTemplate
    }
  }))
}
