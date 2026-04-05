'use client'

import { useState } from 'react'
import SidebarItem from '../../public/icons/sidebar-item.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '../ui/sidebar'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

import SwitchDualIconLabelDemo from '../shadcn-studio/switch/switch-11'
import { Board, boards } from '@/mocks/board.model'
import CreateBoard from '../modals/CreateBoard'

function CustomSidebar() {
  const [isActive, setIsActive] = useState('Platform Launch')
  return (
    <Sidebar collapsible="icon" className="relative border-r border-kborder py-8 h-full">
      <SidebarContent className="justify-between">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-4 px-8 text-[12px] font-bold tracking-[2.4px] text-knetural-default">
            {`ALL BOARDS (${boards.length})`}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2 ">
            {boards.map((board: Board) => (
              <SidebarMenuItem key={board.id} className="flex items-center">
                <SidebarMenuButton
                  className=" flex  items-center w-60.75! h-14 px-8   rounded-r-full  cursor-pointer gap-4 py-0 text-knetural-default transition-colors data-[active=true]:bg-primary-DEFAULT data-[active=true]:text-white font-bold text-[16px] "
                  isActive={isActive === board.name}
                  onClick={() => setIsActive(board.name)}
                >
                  <SidebarItem className="size-4.5!" />

                  <span>{board.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem className="flex items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuButton className="flex  items-center w-60.75! h-14 px-8   rounded-r-full  cursor-pointer gap-4 py-0 text-primary-DEFAULT transition-colors font-bold text-[16px]">
                    <Plus className="size-4.5!" />
                    <span>Create New Board</span>
                  </SidebarMenuButton>
                </DialogTrigger>
                <CreateBoard />
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
              <SidebarMenuItem className="flex justify-center">
                <SidebarMenuButton asChild>
                  <SidebarTrigger className="justify-center items-center hover:bg-none py-0 w-60.75! rounded-[3rem]! hover:bg-transparent!" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default CustomSidebar
