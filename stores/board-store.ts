import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { Columndb } from '@/mocks/column.mock'

export type BoardState = {
  activeBoard: { name: string | undefined; id: number | undefined } | null
  columns: Columndb[]
  openTaskId: string | null
}

export type BoardActions = {
  setActiveBoard: (boardId: number, name: string) => void
  clearActiveBoard: () => void
  setColumns: (columns: Columndb[]) => void
  setOpenTaskId: (taskId: string | null) => void
}

export type BoardStore = BoardState & BoardActions

export const defaultInitState: BoardState = {
  activeBoard: null,
  columns: [],
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
        setOpenTaskId: (taskId) => set({ openTaskId: taskId })
      }),
      {
        name: 'active-board',
        partialize: (state) => ({ activeBoard: state.activeBoard })
      }
    )
  )
}
