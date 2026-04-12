import { Task } from './task.model'

export type Column = {
  id: number
  name: string
  color: string
  position: number
  tasks: Task[]
}

export const columns: Column[] = [
  {
    id: 1,
    name: 'To Do',
    color: '#FF5733',
    position: 1,
    tasks: [
      {
        id: '1',
        title: 'Design UI',
        description: 'Create initial layout',
        columnId: 1,
        createdAt: '2026-04-02',
        subtasks: [{ id: '1-1', title: 'Navbar', taskId: '1', isCompleted: true }]
      }
    ]
  },
  {
    id: 2,
    name: 'In Progress',
    color: '#33C1FF',
    position: 2,
    tasks: []
  },
  {
    id: 3,
    name: 'Done',
    color: '#75FF33',
    position: 3,
    tasks: []
  }
]
