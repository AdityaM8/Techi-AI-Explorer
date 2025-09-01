import { readFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../src/lib/prisma'
import { ensurePgVector, saveToolEmbedding } from '../src/lib/embeddings'

async function main() {
  await ensurePgVector()
  const raw = readFileSync(join(process.cwd(), 'data', 'tools.json'), 'utf-8')
  const tools = JSON.parse(raw)
  for (const t of tools) {
    const tool = await prisma.tool.upsert({
      where: { name: t.name },
      update: {},
      create: {
        name: t.name, isFree: t.isFree, siteUrl: t.siteUrl, category: t.category,
        supportsEmbed: t.supportsEmbed, embedType: t.embedType, authType: t.authType,
        capabilities: JSON.stringify(t.capabilities), calledPromptTemplate: t.calledPromptTemplate, notes: ''
      }
    })
    await saveToolEmbedding(tool.id, [tool.name, tool.category, JSON.parse(tool.capabilities).join(' ')].join(' '))
  }
  console.log(`Seeded ${tools.length} tools with embeddings.`)
}

main().then(()=>process.exit(0)).catch((e)=>{ console.error(e); process.exit(1) })
