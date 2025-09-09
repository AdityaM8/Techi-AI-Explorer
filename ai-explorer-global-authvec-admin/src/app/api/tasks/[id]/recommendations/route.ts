import { NextRequest, NextResponse } from 'next/server'
import { getRecommendations } from '@/lib/recommend'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recs = await getRecommendations(params.id)
    return NextResponse.json(recs)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
