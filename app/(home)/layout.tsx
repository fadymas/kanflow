import CustomSidebar from '@/components/shared/CustomSidebar'
import Header from '@/components/shared/Header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BoardStoreProvider } from '@/providers/board-store-provider'
import QueryProvider from '@/providers/query-provider'
import { Show } from '@clerk/nextjs'
import { cookies, headers } from 'next/headers'
import React from 'react'

async function layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const sidebar_state = cookieStore.get('sidebar_state')?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`, {
    headers: await headers()
  })
  const data = await res.json()

  return (
    <QueryProvider>
      <BoardStoreProvider>
        <Header />
        <SidebarProvider
          defaultOpen={sidebar_state === 'true'}
          className="max-lg:min-h-[calc(100vh-73px)]"
        >
          <Show when="signed-in">
            <CustomSidebar boards={JSON.stringify(data.boards)} />
          </Show>
          {children}
        </SidebarProvider>
      </BoardStoreProvider>
    </QueryProvider>
  )
}

export default layout
