'use client'

import { useState } from 'react'
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from './ui/sidebar'
import { Grid2x2 } from 'lucide-react'

function CustomSidebar() {
  const [isActive, setIsActive] = useState('Platform Launch')
  return (
    <SidebarProvider>
      <Sidebar className="relative border-r border-kborder pt-8">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-4 px-8 text-[12px] font-bold tracking-[2.4px] text-knetural-default">
            ALL BOARDS (3)
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem className="flex items-center">
              <SidebarMenuButton
                className="p-0"
                asChild
                isActive={isActive === '1 Launch'}
                onClick={() => setIsActive('Platform Launch')}
              >
                <div className="flex  items-center w-60.75! h-14 px-8   rounded-r-full  cursor-pointer gap-4 p-0 text-knetural-default transition-colors data-[active=true]:bg-primary-DEFAULT data-[active=true]:text-white ">
                  <Grid2x2 
                    size={18}
                    className="w-4.5! h-4.5! "
                  />
                  <span>Platform Launch</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  )
}

export default CustomSidebar
