export interface Board {
  id: number
  name: string
  ownerId: number
  createdAt: string
  updatedAt: string
}

export const boards: Board[] = [
  {
    id: 1,
    name: 'Project Alpha',
    ownerId: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z'
  },
  {
    id: 2,
    name: 'Project Beta',
    ownerId: 2,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z'
  }
]
