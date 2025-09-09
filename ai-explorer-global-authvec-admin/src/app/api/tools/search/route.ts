import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').toLowerCase()
  const tools = await prisma.tool.findMany()
  const filtered = tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    t.capabilities.toLowerCase().includes(q)
  )
  return NextResponse.json(filtered)
}
