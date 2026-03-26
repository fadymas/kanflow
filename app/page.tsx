import Column, { TaskData } from '@/components/shared/Column'
const tasks: TaskData[] = [
  {
    id: '1',
    title: 'Build UI for onboarding flowddddddd',
    subtasks: { completed: 2, total: 5 },
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    title: 'Implement authentication flow',
    subtasks: { completed: 1, total: 3 },
    priority: 'medium',
    completed: false
  }
]
export default function Home() {
  return (
    <main className="py-8 pl-8 flex gap-8 min-h-full  overflow-x-scroll w-full scroll-container">
      {/* 
      <Column tasks={[]} title="Doing" />
      
      <Column tasks={[]} isAddNew={true} /> */}
      <Column tasks={tasks} title="Todo" />
      <Column tasks={tasks} title="Done" />
      <Column tasks={[]} title="Done" />
      <Column tasks={[]} isAddNew />
    </main>
  )
}
