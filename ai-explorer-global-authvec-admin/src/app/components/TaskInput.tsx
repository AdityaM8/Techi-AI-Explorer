'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function TaskInput() {
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function submit() {
    if (desc.trim().length < 10) return alert('Please describe your task in more detail.')
    setLoading(true)
    const res = await fetch('/api/tasks', { method: 'POST', body: JSON.stringify({ description: desc }), headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return alert(data.error || 'Failed')
    router.push(`/task/${data.taskId}`)
  }
  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Describe your task</h2>
      <textarea className="input min-h-[120px]" placeholder="e.g., Write a 500-word blog on AI in healthcare" value={desc} onChange={e => setDesc(e.target.value)} />
      <div className="flex items-center gap-3">
        <button disabled={loading} onClick={submit} className="btn">{loading ? 'Creating…' : 'Get recommendations'}</button>
        <span className="hint">AI Explorer will suggest the best free tools and open them here.</span>
      </div>
    </div>
  )
}
