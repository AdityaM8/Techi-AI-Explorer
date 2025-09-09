import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveToolEmbedding } from '@/lib/embeddings'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const t = await prisma.tool.findUnique({ where: { id: params.id } })
  if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await saveToolEmbedding(t.id, [t.name, t.category, JSON.parse(t.capabilities).join(' ')].join(' '))
  return NextResponse.json({ ok: true })
}
