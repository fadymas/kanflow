export interface Task {
  id: string
  title: string
  description?: string
  columnId: string
  SubTask: Subtask[]
  createdAt: string
  position: number
}

export interface Subtask {
  id: string
  title: string
  taskId: string
  isCompleted: boolean
}

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Design UI',
    description: 'Create initial layout',
    columnId: '1',
    createdAt: '2026-04-02',
    SubTask: [
      { id: '1-1', title: 'Navbar', taskId: '1', isCompleted: true },
      { id: '1-2', title: 'Sidebar', taskId: '1', isCompleted: false }
    ],
    position: 1
  }
]
