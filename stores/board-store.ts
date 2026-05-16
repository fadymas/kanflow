import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

export type BoardState = {
  activeBoardID: number | null | undefined
  activeBoardName: string | null | undefined
  openTaskId: string | null
}

export type BoardActions = {
  setActiveBoard: (boardId: number, name: string) => void
  clearActiveBoard: () => void
  setOpenTaskId: (taskId: string | null) => void
}

export type BoardStore = BoardState & BoardActions

export const defaultInitState: BoardState = {
  activeBoardID: null,
  activeBoardName: null,
  openTaskId: null
}

export const createBoardStore = (initState: BoardState = defaultInitState) => {
  return createStore<BoardStore>()(
    persist(
      (set) => ({
        ...initState,
        setActiveBoard: (boardId, name) => set({ activeBoardID: boardId, activeBoardName: name }),
        clearActiveBoard: () => set({ activeBoardID: null, activeBoardName: null }),
        setOpenTaskId: (taskId) => set({ openTaskId: taskId })
      }),
      {
        name: 'active-board',
        partialize: (state) => ({
          activeBoardID: state.activeBoardID,
          activeBoardName: state.activeBoardName
        })
      }
    )
  )
}
