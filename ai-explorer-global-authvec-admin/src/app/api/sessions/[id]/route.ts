import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const s = await prisma.chatSession.findUnique({ where: { id: params.id }, include: { tool: true, task: true } })
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(s)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const s = await prisma.chatSession.findUnique({ where: { id: params.id } })
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const body = await req.json()
  const messages = JSON.parse(s.transcript) as any[]
  messages.push({ role: body.role || 'user', content: String(body.content || ''), ts: new Date().toISOString() })
  await prisma.chatSession.update({ where: { id: s.id }, data: { transcript: JSON.stringify(messages) } })
  return NextResponse.json({ ok: true, count: messages.length })
}
