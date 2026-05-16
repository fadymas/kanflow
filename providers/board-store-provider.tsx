'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'
import { BoardState, type BoardStore, createBoardStore } from '@/stores/board-store'

export type BoardStoreApi = ReturnType<typeof createBoardStore>

export const BoardStoreContext = createContext<BoardStoreApi | undefined>(undefined)

export function BoardStoreProvider({
  children,
  initialData
}: {
  children: ReactNode
  initialData: BoardState
}) {
  const [store] = useState(() => createBoardStore(initialData))
  return <BoardStoreContext.Provider value={store}>{children}</BoardStoreContext.Provider>
}

export function useBoardStore<T>(selector: (store: BoardStore) => T): T {
  const context = useContext(BoardStoreContext)
  if (!context) throw new Error('useBoardStore must be used within BoardStoreProvider')
  return useStore(context, selector)
}
