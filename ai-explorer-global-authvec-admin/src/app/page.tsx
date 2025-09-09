import TaskInput from '@/components/TaskInput'
export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">AI Explorer</h1>
      <p className="text-slate-300">State your task → get the best free AI tool → work here in a seamless multi-chat environment.</p>
      <TaskInput />
    </main>
  )
}
