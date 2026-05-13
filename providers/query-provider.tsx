'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { Board } from '@/mocks/board.mock'

interface Props {
  children: ReactNode
  initialBoards?: Board[]
}

export default function QueryProvider({ children, initialBoards }: Props) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          retry: 1
        }
      }
    })

    // Seed the cache with server-fetched boards so the sidebar renders immediately
    // without a client-side loading state on first paint
    if (initialBoards && initialBoards.length > 0) {
      client.setQueryData(['boards'], initialBoards)
    }

    return client
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
