/* eslint-disable react-hooks/set-state-in-effect */
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
import CreateBoard from '../dialogs/BoardDialog'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useBoardStore } from '@/providers/board-store-provider'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Board } from '@/mocks/board.mock'

function CustomSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const activeBoardId = useBoardStore((state) => state.activeBoardID)
  const setActiveBoardId = useBoardStore((state) => state.setActiveBoard)

  const { data: boards = [] } = useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`)
        .then((res) => res.json())
        .then((data) => data.boards ?? [])
  })

  // Guard: if persisted activeBoardId no longer exists in boards, clear it
  useEffect(() => {
    if (boards.length > 0 && activeBoardId && !boards.find((b) => b.id === activeBoardId)) {
      setActiveBoardId(boards[0].id, boards[0].name)
    }
  }, [boards, activeBoardId, setActiveBoardId])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {isMobile && (
        <SidebarTrigger className="absolute bg-primary-DEFAULT text-white bottom-10 left-5 z-20" />
      )}

      <Sidebar collapsible="icon" className="relative border-r border-kborder py-8 h-full">
        {isMobile && (
          <SidebarHeader className="flex flex-row gap-3 items-center ml-5 mt-3 mb-5">
            <Image src="/logo.png" width={40} height={40} alt="logo" loading="eager" />
            <h2 className="text-[24px] font-extrabold text-foreground">
              Kan<span className="text-primary-DEFAULT">Flow</span>
            </h2>
          </SidebarHeader>
        )}

        <SidebarContent className={cn('justify-between', isMobile ? 'pb-5' : '')}>
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="mb-4 px-8 text-[12px] font-bold tracking-[2.4px] text-knetural-default">
              {`ALL BOARDS (${boards.length})`}
            </SidebarGroupLabel>

            <SidebarMenu className="gap-2 mb-5">
              {boards.map((board: Board) => (
                <SidebarMenuItem key={board.id} className="flex items-center">
                  <SidebarMenuButton
                    className="flex items-center w-60.75! h-14 px-8 rounded-r-full cursor-pointer gap-4 py-0 text-knetural-default transition-colors data-[active=true]:bg-primary-DEFAULT data-[active=true]:text-white font-bold text-[16px]"
                    isActive={activeBoardId ? activeBoardId === board.id : false}
                    onClick={() => {
                      setActiveBoardId(board.id, board.name)
                      setOpenMobile(false)
                      document.cookie = `active-boardId=${board.id}`
                      document.cookie = `active-boardName=${board.name}`
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
                    <SidebarMenuButton className="flex items-center w-60.75! h-14 px-8 rounded-r-full cursor-pointer gap-4 py-0 text-primary-DEFAULT transition-colors font-bold text-[16px]">
                      <Plus className="size-4.5!" />
                      <span>Create New Board</span>
                    </SidebarMenuButton>
                  </DialogTrigger>
                  {open && <CreateBoard onSuccess={() => setOpen(false)} />}
                </Dialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-4">
                <SidebarMenuItem className="flex justify-center">
                  <SidebarMenuButton asChild className="py-0 w-60.75!">
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

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div
                      className={cn(
                        'w-full flex justify-center h-22',
                        state === 'collapsed' && !isMobile ? '' : 'userButton'
                      )}
                    >
                      {mounted ? (
                        <UserButton />
                      ) : (
                        <div
                          className={cn(
                            'w-full flex justify-center size-5.25! bg-black rounded-full py-0!',
                            state === 'collapsed' && !isMobile ? '' : 'size-22!'
                          )}
                        />
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}

export default CustomSidebar
