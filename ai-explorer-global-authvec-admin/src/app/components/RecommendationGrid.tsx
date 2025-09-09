'use client'
import { useEffect, useState } from 'react'
import RecommendationCard from './RecommendationCard'
import { Tool, Recommendation } from '@/types'
export default function RecommendationGrid({ taskId, onSelect }:{ taskId: string, onSelect: (tool: Tool) => void }) {
  const [recs, setRecs] = useState<Recommendation[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    fetch(`/api/tasks/${taskId}/recommendations`).then(r => r.json()).then((d) => { if (d.error) setErr(d.error); else setRecs(d) }).catch(e => setErr(String(e)))
  }, [taskId])
  if (err) return <div className="card text-red-300">Error: {err}</div>
  if (!recs) return <div className="card">Finding the best free tools…</div>
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {recs.map((r) => (<RecommendationCard key={r.rank} tool={r.tool as any} rationale={r.rationale} onSelect={onSelect} />))}
    </div>
  )
}
