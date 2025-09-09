import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const desc: string = (body.description || '').toString().trim()
  if (desc.length < 10) return NextResponse.json({ error: 'Description too short' }, { status: 400 })
  const title = desc.slice(0, 60)
  const task = await prisma.task.create({ data: { title, description: desc, tags: JSON.stringify(body.tags || []) } })
  return NextResponse.json({ taskId: task.id, title: task.title })
}
