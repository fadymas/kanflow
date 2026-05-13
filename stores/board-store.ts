import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { Columndb } from '@/mocks/column.mock'
import { Task } from '@/mocks/task.model'

export type BoardState = {
  activeBoard: { name: string | undefined; id: number | undefined } | null
  columns: Columndb[]
  boards: {
    id: number
    name: string
    Column: Columndb[]
  }[]
  openTaskId: string | null
}

export type BoardActions = {
  setActiveBoard: (boardId: number, name: string) => void
  clearActiveBoard: () => void
  setColumns: (columns: Columndb[]) => void
  setBoards: (
    boards: {
      id: number
      name: string
      Column: Columndb[]
    }[]
  ) => void
  changeTaskColumn: (taskId: string, fromColumnId: string, toColumnId: string, task: Task) => void
  setOpenTaskId: (taskId: string | null) => void
}

export type BoardStore = BoardState & BoardActions

export const defaultInitState: BoardState = {
  activeBoard: null,
  columns: [],
  boards: [],
  openTaskId: null
}

export const createBoardStore = (initState: BoardState = defaultInitState) => {
  return createStore<BoardStore>()(
    persist(
      (set) => ({
        ...initState,
        setActiveBoard: (boardId, name) => set({ activeBoard: { id: boardId, name: name } }),
        clearActiveBoard: () => set({ activeBoard: null, columns: [] }),
        setColumns: (columns) => set({ columns }),
        setBoards: (boards) => set({ boards }),
        setOpenTaskId: (taskId) => set({ openTaskId: taskId }),
        changeTaskColumn: (taskId, fromColumnId, toColumnId, task) =>
          set((state) => ({
            columns: state.columns.map((col) => {
              if (col.id == fromColumnId)
                return { ...col, Task: col.Task.filter((t) => t.id != taskId) }
              if (col.id == toColumnId) return { ...col, Task: [...col.Task, task] }
              return col
            })
          }))
      }),
      {
        name: 'active-board',
        partialize: (state) => ({ activeBoard: state.activeBoard }) // only persist activeBoard, not columns or boards
      }
    )
  )
}
