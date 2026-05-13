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
  const activeBoardId = cookieStore.get('active-boardId')?.value
  const activeBoardName = cookieStore.get('active-boardName')?.value

  const user = await auth()
  let data
  let columns
  if (user.isAuthenticated) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`, {
      headers: await headers()
    })
    data = await res.json()
    columns = data.boards?.find((board: Board) => board.id == Number(activeBoardId))?.Column
  }

  return (
    <QueryProvider>
      <BoardStoreProvider
        initial={{
          boards: data?.boards || [],
          activeBoard: { id: Number(activeBoardId), name: activeBoardName },
          columns: columns,
          openTaskId: null
        }}
      >
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
