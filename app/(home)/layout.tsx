import CustomSidebar from '@/components/navigation/Sidebar'
import Header from '@/components/navigation/Header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Board } from '@/mocks/board.mock'
import { BoardStoreProvider } from '@/providers/board-store-provider'
import QueryProvider from '@/providers/query-provider'
import { Show } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { cookies, headers } from 'next/headers'
import React from 'react'

async function layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const sidebar_state = cookieStore.get('sidebar_state')?.value

  const user = await auth()
  let initialBoards: Board[] = []

  if (user.isAuthenticated) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`, {
      headers: await headers()
    })
    const data = await res.json()
    initialBoards = data.boards ?? []
  }

  return (
    <QueryProvider initialBoards={initialBoards}>
      <BoardStoreProvider>
        <Header />
        <SidebarProvider
          defaultOpen={sidebar_state === 'true'}
          className="max-lg:min-h-[calc(100vh-73px)]"
        >
          <Show when="signed-in">
            <CustomSidebar />
          </Show>
          {children}
        </SidebarProvider>
      </BoardStoreProvider>
    </QueryProvider>
  )
}

export default layout
