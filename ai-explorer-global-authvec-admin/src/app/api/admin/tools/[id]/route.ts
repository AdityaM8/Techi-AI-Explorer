import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveToolEmbedding } from '@/lib/embeddings'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const t = await prisma.tool.update({ where: { id: params.id }, data: {
    name: body.name, siteUrl: body.siteUrl, category: body.category,
    supportsEmbed: !!body.supportsEmbed, embedType: body.embedType, authType: body.authType,
    capabilities: JSON.stringify(body.capabilities || []), calledPromptTemplate: body.calledPromptTemplate || '', notes: body.notes || ''
  }})
  await saveToolEmbedding(t.id, [t.name, t.category, JSON.parse(t.capabilities).join(' ')].join(' '))
  return NextResponse.json(t)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.tool.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
