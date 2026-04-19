import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { Columndb } from '@/mocks/column.model'

export type BoardState = {
  activeBoardId: number | null
  columns: Columndb[]
}

export type BoardActions = {
  setActiveBoard: (boardId: number) => void
  setColumns: (columns: Columndb[]) => void
}

export type BoardStore = BoardState & BoardActions

export const defaultInitState: BoardState = {
  activeBoardId: null,
  columns: []
}

export const createBoardStore = (initState: BoardState = defaultInitState) => {
  return createStore<BoardStore>()(
    persist(
      (set) => ({
        ...initState,
        setActiveBoard: (boardId) => set({ activeBoardId: boardId }),
        setColumns: (columns) => set({ columns })
      }),
      {
        name: 'active-board',
        partialize: (state) => ({ activeBoardId: state.activeBoardId }) // only persist activeBoardId, not columns
      }
    )
  )
}
