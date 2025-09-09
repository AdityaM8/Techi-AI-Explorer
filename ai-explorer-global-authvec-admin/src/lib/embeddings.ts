import crypto from 'crypto'
import { prisma } from './prisma'

const DIM = 1536

function hashEmbed(text: string): number[] {
  // Simple, deterministic hashing to DIM-d vector for offline/dev use
  const vec = new Array<number>(DIM).fill(0)
  const tokens = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  for (const tok of tokens) {
    const h = crypto.createHash('sha256').update(tok).digest()
    for (let i=0;i<8;i++){
      const idx = (h[i] + i*257) % DIM
      vec[idx] += 1
    }
  }
  // L2 normalize
  const norm = Math.sqrt(vec.reduce((s,v)=>s+v*v,0)) || 1
  return vec.map(v => v / norm)
}

async function openAIEmbed(text: string): Promise<number[] | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  try {
    const r = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'text-embedding-3-large', input: text })
    })
    const d = await r.json()
    return d.data[0].embedding as number[]
  } catch {
    return null
  }
}

export async function embedText(text: string): Promise<number[]> {
  const real = await openAIEmbed(text)
  if (real && Array.isArray(real)) return real
  return hashEmbed(text)
}

export async function saveToolEmbedding(toolId: string, text: string) {
  const vec = await embedText(text)
  // Build SQL array literal
  const arr = 'ARRAY[' + vec.map(v => Number(v.toFixed(6))).join(',') + ']'
  await prisma.$executeRawUnsafe(`UPDATE "Tool" SET embedding = ${arr}::vector(${DIM}) WHERE id = $1`, toolId as any)
}

export async function ensurePgVector() {
  await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector')
  await prisma.$executeRawUnsafe('ALTER TABLE "Tool" ADD COLUMN IF NOT EXISTS embedding vector(1536)')
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS tool_embedding_idx ON "Tool" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)')
}
