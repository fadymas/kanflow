import CustomSidebar from '@/components/shared/CustomSidebar'
import Header from '@/components/shared/Header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Show } from '@clerk/nextjs'
import { cookies } from 'next/headers'
import React from 'react'

async function layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const sidebar_state = cookieStore.get('sidebar_state')?.value
  return (
    <>
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
    </>
  )
}

export default layout
