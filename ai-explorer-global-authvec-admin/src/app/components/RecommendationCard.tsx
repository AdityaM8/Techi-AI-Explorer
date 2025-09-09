'use client'
import { Tool } from '@/types'
export default function RecommendationCard({ tool, rationale, onSelect }:{ tool: Tool, rationale: string, onSelect: (tool: Tool) => void }) {
  return (
    <div className="card hover:border-blue-600 transition cursor-pointer" onClick={() => onSelect(tool)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{tool.name}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-600/20 border border-blue-600 text-blue-200">{tool.category}</span>
      </div>
      <p className="text-sm text-slate-300 mt-2">{rationale}</p>
      <div className="text-xs text-slate-400 mt-3">
        <span>{tool.supportsEmbed ? 'Embeds inside AI Explorer' : 'Opens externally'}</span>
      </div>
      <button className="btn mt-4 w-full">Select & Open</button>
    </div>
  )
}
