import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sessions = await prisma.chatSession.findMany({ where: { taskId: params.id }, orderBy: { startedAt: 'desc' }, include: { tool: true } })
  return NextResponse.json(sessions.map(s => ({ id: s.id, title: s.title, tool: s.tool, startedAt: s.startedAt, status: s.status })))
}
