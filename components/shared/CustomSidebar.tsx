'use client'
import SidebarItem from '../../public/icons/sidebar-item.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '../ui/sidebar'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

import SwitchDualIconLabelDemo from '../vendor/shadcn-studio/switch/switch-11'
import { Board } from '@/mocks/board.model'
import CreateBoard from '../modals/CreateBoard'
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useBoardStore } from '@/providers/board-store-provider'
import { useEffect, useState } from 'react'

function CustomSidebar({ boards }: { boards: string }) {
  const parsedBoards = JSON.parse(boards)
  const { state, isMobile, setOpenMobile } = useSidebar()
  const [open, setOpen] = useState(false)

  const activeBoardId = useBoardStore((state) => state.activeBoardId)
  const setActiveBoardId = useBoardStore((state) => state.setActiveBoard)

  useEffect(() => {
    if (parsedBoards.length === 0) return

    if (!activeBoardId) {
      setActiveBoardId(parsedBoards[0].id)
    }
  }, [activeBoardId, parsedBoards, setActiveBoardId])
  return (
    <>
      {isMobile && (
        <SidebarTrigger className="absolute bg-primary-DEFAULT text-white bottom-10 left-5" />
      )}

      <Sidebar collapsible="icon" className="relative border-r border-kborder py-8 h-full">
        {isMobile && (
          <SidebarHeader className="flex flex-row gap-3 items-center ml-5  mt-3 mb-5">
            <Image src="/logo.png" width={40} height={40} alt="logo" loading="eager" />
            <h2 className="text-[24px] font-extrabold text-foreground  ">
              Kan<span className="text-primary-DEFAULT">Flow</span>
            </h2>
          </SidebarHeader>
        )}

        <SidebarContent className={cn('justify-between ', isMobile ? 'pb-5' : '')}>
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="mb-4 px-8 text-[12px] font-bold tracking-[2.4px] text-knetural-default">
              {`ALL BOARDS (${parsedBoards.length})`}
            </SidebarGroupLabel>

            <SidebarMenu className="gap-2  mb-5">
              {parsedBoards.map((board: Board) => (
                <SidebarMenuItem key={board.id} className="flex items-center">
                  <SidebarMenuButton
                    className=" flex  items-center w-60.75! h-14 px-8   rounded-r-full  cursor-pointer gap-4 py-0 text-knetural-default transition-colors data-[active=true]:bg-primary-DEFAULT data-[active=true]:text-white font-bold text-[16px] "
                    isActive={activeBoardId === board.id}
                    onClick={() => {
                      setActiveBoardId(board.id)
                      setOpenMobile(false)
                    }}
                  >
                    <SidebarItem className="size-4.5!" />

                    <span>{board.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem className="flex items-center">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <SidebarMenuButton className="flex  items-center w-60.75! h-14 px-8   rounded-r-full  cursor-pointer gap-4 py-0 text-primary-DEFAULT transition-colors font-bold text-[16px]">
                      <Plus className="size-4.5!" />
                      <span>Create New Board</span>
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <CreateBoard onSuccess={() => setOpen(false)} />
                </Dialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="p-0 ">
            <SidebarGroupContent>
              <SidebarMenu className="gap-4">
                <SidebarMenuItem className="flex justify-center">
                  <SidebarMenuButton asChild className="py-0 w-60.75! ">
                    <div className="p-4 bg-kbackground rounded-[3rem]! flex justify-center items-center gap-4 h-13.5">
                      <SwitchDualIconLabelDemo />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {!isMobile && (
                  <SidebarMenuItem className="flex justify-center">
                    <SidebarMenuButton asChild>
                      <SidebarTrigger className="justify-center items-center hover:bg-none py-0 w-60.75! rounded-[3rem]! hover:bg-transparent! text-knetural-default" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div
                      className={cn(
                        `w-full flex justify-center h-20`,
                        state === 'collapsed' && !isMobile ? '' : 'userButton'
                      )}
                    >
                      <ClerkLoading>
                        <p>Clerk is loading...</p>
                      </ClerkLoading>
                      <ClerkLoaded>
                        <UserButton />
                      </ClerkLoaded>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}

export default CustomSidebar
