'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import RecommendationGrid from '@/components/RecommendationGrid'
import SessionTabs from '@/components/SessionTabs'
import EmbeddedChat from '@/components/EmbeddedChat'
import { Tool } from '@/types'
export default function TaskPage({ params }: { params: { id: string } }) {
  const taskId = params.id
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session') || undefined
  const [activeSession, setActiveSession] = useState<string | undefined>(sessionId)
  const [activeRationale, setActiveRationale] = useState<string>('Select a tool to see rationale.')
  useEffect(() => { if (sessionId) setActiveSession(sessionId) }, [sessionId])
  async function onSelect(tool: Tool) {
    const r = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taskId, toolId: tool.id }) })
    const d = await r.json()
    if (!r.ok) return alert(d.error || 'Failed to create session')
    window.history.replaceState({}, '', `/task/${taskId}?session=${d.sessionId}`)
    setActiveSession(d.sessionId); setActiveRationale('Embeds or opens the selected tool here. Seed prompt added to transcript.')
  }
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Task Workspace</h1>
      <SessionTabs taskId={taskId} activeId={activeSession} />
      {activeSession ? <EmbeddedChat sessionId={activeSession} /> : <RecommendationGrid taskId={taskId} onSelect={onSelect} />}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-2"></div>
        <div>
          <div className="card">
            <div className="font-semibold mb-2">Context</div>
            <p className="text-sm text-slate-300">{activeRationale}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
