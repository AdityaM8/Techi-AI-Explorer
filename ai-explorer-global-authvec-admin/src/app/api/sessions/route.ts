import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function buildCalledPrompt(template: string | null, taskDesc: string) {
  const base = template || `SYSTEM: Assist the user to accomplish the task. Task: {{task_description}}. Steps: propose plan then execute.`
  return base.replace(/\{\{task_description\}\}/g, taskDesc)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { taskId, toolId } = body
  if (!taskId || !toolId) return NextResponse.json({ error: 'taskId and toolId are required' }, { status: 400 })
  const [task, tool] = await Promise.all([
    prisma.task.findUnique({ where: { id: taskId } }),
    prisma.tool.findUnique({ where: { id: toolId } })
  ])
  if (!task || !tool) return NextResponse.json({ error: 'Invalid task or tool' }, { status: 404 })

  const seed = { role: 'system', content: buildCalledPrompt(tool.calledPromptTemplate, task.description), ts: new Date().toISOString() }
  const session = await prisma.chatSession.create({
    data: { taskId, toolId, title: `${task.title.slice(0, 24)} – ${tool.name}`, transcript: JSON.stringify([seed]) }
  })
  return NextResponse.json({ sessionId: session.id, seedMessage: seed, tool })
}
