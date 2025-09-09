'use client'
import { useEffect, useState } from 'react'

type Tool = {
  id?: string; name: string; siteUrl: string; category: string;
  supportsEmbed: boolean; embedType: string; authType: string;
  capabilities: string[]; calledPromptTemplate?: string; notes?: string;
}

const empty: Tool = { name: '', siteUrl: '', category: 'writing', supportsEmbed: true, embedType: 'iframe', authType: 'none', capabilities: [] }

export default function AdminPage() {
  const [tools, setTools] = useState<any[]>([])
  const [form, setForm] = useState<Tool>(empty)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function load(){ const r = await fetch('/api/admin/tools'); setTools(await r.json()) }
  useEffect(()=>{ load() }, [])

  async function save() {
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/admin/tools/${editingId}` : '/api/admin/tools'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!r.ok) return alert('Save failed')
    setForm(empty); setEditingId(null); await load()
  }
  async function edit(t:any){ setEditingId(t.id); setForm({ ...t, capabilities: JSON.parse(t.capabilities) }) }
  async function del(id:string){ if(!confirm('Delete?')) return; await fetch(`/api/admin/tools/${id}`, { method:'DELETE' }); await load() }
  async function embed(id:string){ await fetch(`/api/admin/tools/${id}/embed`, { method:'POST' }); alert('Embedding computed'); }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin – Tools Catalog</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <div className="font-semibold">Add / Edit Tool</div>
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="input" placeholder="Site URL" value={form.siteUrl} onChange={e=>setForm({...form, siteUrl:e.target.value})} />
          <input className="input" placeholder="Category (e.g., writing, design, code, research)" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
          <div className="flex gap-3">
            <label className="text-sm"><input type="checkbox" checked={form.supportsEmbed} onChange={e=>setForm({...form, supportsEmbed:e.target.checked})}/> Supports Embed</label>
            <input className="input" placeholder="Embed Type (iframe|api|linkout)" value={form.embedType} onChange={e=>setForm({...form, embedType:e.target.value})} />
            <input className="input" placeholder="Auth Type (none|free-login)" value={form.authType} onChange={e=>setForm({...form, authType:e.target.value})} />
          </div>
          <input className="input" placeholder="Capabilities (comma-separated)" value={form.capabilities.join(', ')} onChange={e=>setForm({...form, capabilities:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
          <textarea className="input min-h-[120px]" placeholder="Called Prompt Template (optional)" value={form.calledPromptTemplate || ''} onChange={e=>setForm({...form, calledPromptTemplate:e.target.value})} />
          <textarea className="input" placeholder="Notes (optional)" value={form.notes || ''} onChange={e=>setForm({...form, notes:e.target.value})} />
          <div className="flex gap-3">
            <button className="btn" onClick={save}>{editingId ? 'Update Tool' : 'Create Tool'}</button>
            {editingId && <button className="btn" onClick={()=>{ setForm(empty); setEditingId(null) }}>Cancel</button>}
          </div>
        </div>
        <div className="card space-y-3">
          <div className="font-semibold">Catalog</div>
          <div className="space-y-2 max-h-[520px] overflow-auto">
            {tools.map(t => (
              <div key={t.id} className="border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.name} <span className="text-xs text-slate-400">({t.category})</span></div>
                    <div className="text-xs text-slate-400">{t.siteUrl}</div>
                    <div className="text-xs text-slate-400">Caps: {JSON.parse(t.capabilities).join(', ')}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn" onClick={()=>edit(t)}>Edit</button>
                    <button className="btn" onClick={()=>embed(t.id)}>Embed</button>
                    <button className="btn" onClick={()=>del(t.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
