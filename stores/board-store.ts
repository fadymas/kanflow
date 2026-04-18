import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

export type BoardState = {
  activeBoardId: number | null
}

export type BoardActions = {
  setActiveBoard: (boardId: number) => void
}

export type BoardStore = BoardState & BoardActions

export const defaultInitState: BoardState = {
  activeBoardId: null
}

export const createBoardStore = (initState: BoardState = defaultInitState) => {
  return createStore<BoardStore>()(
    persist(
      (set) => ({
        ...initState,
        setActiveBoard: (boardId) => set({ activeBoardId: boardId })
      }),
      { name: 'active-board' }
    )
  )
}
