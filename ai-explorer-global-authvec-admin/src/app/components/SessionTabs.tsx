'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
export default function SessionTabs({ taskId, activeId }:{ taskId: string, activeId?: string }) {
  const [sessions, setSessions] = useState<any[]>([])
  async function load(){ const r = await fetch(`/api/tasks/${taskId}/sessions`); const d = await r.json(); setSessions(d) }
  useEffect(() => { load() }, [taskId])
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {sessions.map((s) => (
        <Link key={s.id} href={`/task/${taskId}?session=${s.id}`} className={`px-3 py-2 rounded-xl border ${activeId===s.id ? 'border-blue-600 bg-blue-600/10' : 'border-slate-800 bg-slate-900/50'}`}>
          <span className="text-xs">{s.title}</span>
        </Link>
      ))}
    </div>
  )
}
