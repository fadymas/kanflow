import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { Columndb } from '@/mocks/column.model'
import { Board } from '@/mocks/board.model'

export type BoardState = {
  activeBoard: { name: string; id: number } | null
  columns: Columndb[]
  boards: Pick<Board, 'id' | 'name'>[]
}

export type BoardActions = {
  setActiveBoard: (boardId: number, name: string) => void
  clearActiveBoard: () => void
  setColumns: (columns: Columndb[]) => void
  setBoards: (boards: Pick<Board, 'id' | 'name'>[]) => void
}

export type BoardStore = BoardState & BoardActions

export const defaultInitState: BoardState = {
  activeBoard: null,
  columns: [],
  boards: []
}

export const createBoardStore = (initState: BoardState = defaultInitState) => {
  return createStore<BoardStore>()(
    persist(
      (set) => ({
        ...initState,
        setActiveBoard: (boardId, name) => set({ activeBoard: { id: boardId, name: name } }),
        clearActiveBoard: () => set({ activeBoard: null, columns: [] }),
        setColumns: (columns) => set({ columns }),
        setBoards: (boards) => set({ boards })
      }),
      {
        name: 'active-board',
        partialize: (state) => ({ activeBoard: state.activeBoard }) // only persist activeBoard, not columns or boards
      }
    )
  )
}
