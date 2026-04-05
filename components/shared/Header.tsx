import Image from 'next/image'
import { Button } from '../ui/button'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

import MobileNavMenu from './MobileNavMenu'
import CustomDropdownMenu from './CustomDropdown-menu'
import CreateTask from '../modals/CreateTask'

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
              className="w-40 h-12 rounded-full px-6 py-3 gap-2 from-primary-300 to-primary-400 bg-linear-to-r text-white max-md:w-1 max-md:h-1 "
            >
              <Plus />
              <span className="max-md:hidden">Add New Task</span>
            </Button>
          </DialogTrigger>
          <CreateTask />
        </Dialog>
        <CustomDropdownMenu isBoard={true} />
      </div>
    </header>
  )
}

export default Header
