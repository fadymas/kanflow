import Image from 'next/image'
import { Button } from '../ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { EllipsisVertical, List, Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../ui/sheet'
import MobileNavMenu from './MobileNavMenu'

function Header() {
  return (
    <header className="flex items-center justify-between  lg:px-8 lg:h-24  px-5 py-4 lg:py-0 k-panal border-b border-kborder">
      <div className="logo flex justify-center items-center gap-3 ">
        <Image
          src="/logo.png"
          alt="Logo"
          loading="eager"
          width={46}
          height={46}
          className="lg:w-11.5 lg:h-11.5 w-10"
        />
        <MobileNavMenu />
      </div>
      <div className="actions flex gap-6 items-center max-lg:gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-40 h-12 rounded-full px-6 py-3 gap-2 from-primary-300 to-primary-400 bg-linear-to-r text-white max-lg:w-1 max-lg:h-1 "
            >
              <Plus />
              <span className="max-lg:hidden">Add New Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="max-lg:hidden">
              <EllipsisVertical size={18} className="size-4.5! text-knetural-default" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
