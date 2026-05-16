import { Task } from './task.mock'

export type Columndb = {
  id: string
  name: string
  color: string
  position: number
  Task: Task[]
}

export const columns: Columndb[] = [
  {
    id: '1',
    name: 'To Do',
    color: '#FF5733',
    position: 1,
    Task: [
      {
        id: '1',
        title: 'Design UI',
        description: 'Create initial layout',
        columnId: '1',
        createdAt: '2026-04-02',
        SubTask: [{ id: '1-1', title: 'Navbar', taskId: '1', isCompleted: true }],
        position: 1
      },
      {
        id: '2',
        title: ' UI',
        description: 'Create initial layout',
        columnId: '1',
        createdAt: '2026-04-02',
        SubTask: [{ id: '1-1', title: 'Navbar', taskId: '1', isCompleted: true }],
        position: 2
      }
    ]
  },
  {
    id: '2',
    name: 'In Progress',
    color: '#33C1FF',
    position: 2,
    Task: [
      {
        id: '3',
        title: 'Design UI',
        description: 'Create initial layout',
        columnId: '2',
        createdAt: '2026-04-02',
        SubTask: [{ id: '1-1', title: 'Navbar', taskId: '1', isCompleted: true }],
        position: 1
      },
      {
        id: '4',
        title: ' UI',
        description: 'Create initial layout',
        columnId: '2',
        createdAt: '2026-04-02',
        SubTask: [{ id: '1-1', title: 'Navbar', taskId: '1', isCompleted: true }],
        position: 2
      }
    ]
  },
  {
    id: '3',
    name: 'Done',
    color: '#75FF33',
    position: 3,
    Task: []
  }
]
