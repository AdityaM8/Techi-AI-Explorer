import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveToolEmbedding } from '@/lib/embeddings'

export async function GET() {
  const tools = await prisma.tool.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(tools)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const t = await prisma.tool.create({ data: {
    name: body.name, isFree: true, siteUrl: body.siteUrl, category: body.category,
    supportsEmbed: !!body.supportsEmbed, embedType: body.embedType || 'iframe', authType: body.authType || 'none',
    capabilities: JSON.stringify(body.capabilities || []), calledPromptTemplate: body.calledPromptTemplate || '', notes: body.notes || ''
  }})
  await saveToolEmbedding(t.id, [t.name, t.category, JSON.parse(t.capabilities).join(' ')].join(' '))
  return NextResponse.json(t, { status: 201 })
}
