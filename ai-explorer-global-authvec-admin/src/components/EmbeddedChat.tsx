'use client'
import { useEffect, useState } from 'react'
export default function EmbeddedChat({ sessionId }:{ sessionId: string }) {
  const [data, setData] = useState<any | null>(null)
  const [text, setText] = useState('')
  async function load(){ const r = await fetch(`/api/sessions/${sessionId}`); const d = await r.json(); setData(d) }
  useEffect(() => { load() }, [sessionId])
  async function send(){
    if (!text.trim()) return
    await fetch(`/api/sessions/${sessionId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'user', content: text }) })
    setText(''); await load()
  }
  if (!data) return <div className="card">Loading session…</div>
  const siteUrl = data.tool.siteUrl as string
  const supportsEmbed = data.tool.supportsEmbed as boolean
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card space-y-3">
        <div className="font-semibold">Transcript</div>
        <div className="space-y-2 max-h-[420px] overflow-auto">
          {JSON.parse(data.transcript).map((m:any, i:number) => (
            <div key={i} className="text-sm">
              <span className="text-slate-400 mr-2">[{m.role}]</span>
              <span>{m.content}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input" placeholder="Send a message to this agent…" value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn" onClick={send}>Send</button>
        </div>
      </div>
      <div className="card">
        <div className="font-semibold mb-2">Agent Window</div>
        {supportsEmbed ? (
          <iframe src={siteUrl} className="w-full h-[460px] rounded-xl border border-slate-800" />
        ) : (
          <div className="text-sm text-slate-300">This tool doesn&apos;t support embedding. <a className="text-blue-400 underline" href={siteUrl} target="_blank">Open externally</a> and paste results back here.</div>
        )}
      </div>
    </div>
  )
}
