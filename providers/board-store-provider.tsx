'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'
import { type BoardStore, createBoardStore } from '@/stores/board-store'

export type BoardStoreApi = ReturnType<typeof createBoardStore>

export const BoardStoreContext = createContext<BoardStoreApi | undefined>(undefined)

export function BoardStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createBoardStore())
  return <BoardStoreContext.Provider value={store}>{children}</BoardStoreContext.Provider>
}

export function useBoardStore<T>(selector: (store: BoardStore) => T): T {
  const context = useContext(BoardStoreContext)
  if (!context) throw new Error('useBoardStore must be used within BoardStoreProvider')
  return useStore(context, selector)
}
