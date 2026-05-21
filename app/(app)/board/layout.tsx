import CustomSidebar from '@/components/app/navigation/Sidebar'
import Header from '@/components/app/navigation/Header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Board } from '@/mocks/board.mock'
import { BoardStoreProvider } from '@/providers/board-store-provider'
import QueryProvider from '@/providers/query-provider'
import { Show } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import React from 'react'

async function layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const sidebar_state = cookieStore.get('sidebar_state')?.value
  const activeBoardId = cookieStore.get('active-boardId')?.value || '0'
  const activeBoardName = cookieStore.get('active-boardName')?.value

  let initialBoards: Board[] = []

  try {
    const { userId } = await auth()
    if (userId) {
      const user = await prisma.user.findFirst({ where: { clerkId: userId } })
      if (user) {
        const boards = await prisma.board.findMany({
          where: { ownerId: user.id },
          select: { id: true, name: true, Column: { select: { id: true, name: true, position: true, color: true } } },
          orderBy: { created_at: 'asc' }
        })
        initialBoards = JSON.parse(
          JSON.stringify(boards, (_, v) => (typeof v === 'bigint' ? Number(v) : v))
        )
      }
    }
  } catch (e) {
    console.error('Failed to fetch initial boards:', e)
  }

  return (
    <QueryProvider initialBoards={initialBoards}>
      <BoardStoreProvider
        initialData={{
          activeBoardID: Number(activeBoardId),
          activeBoardName: activeBoardName,
          openTaskId: null
        }}
      >
        <SidebarProvider defaultOpen={sidebar_state === 'true'} className="flex flex-col h-screen">
          <Header />
          <div className="flex h-full max-h-[calc(100dvh-64px)]">
            <Show when="signed-in">
              <CustomSidebar />
            </Show>
            {children}
          </div>
        </SidebarProvider>
      </BoardStoreProvider>
    </QueryProvider>
  )
}

export default layout
