import Image from 'next/image'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
// import MobileNavMenu from './MobileNavMenu'
import CustomDropdownMenu from './CustomDropdown-menu'
import CreateTask from '../modals/CreateTask'
import { Show, SignInButton, SignUpButton } from '@clerk/nextjs'

async function Header() {
  return (
    <header className="flex items-center justify-between  lg:px-8 lg:h-24  px-2 py-4 lg:py-0 k-panal border-b border-kborder">
      <div className="logo flex justify-center items-center gap-3 ">
        <Image
          src="/logo.png"
          alt="Logo"
          loading="eager"
          width={46}
          height={46}
          className="lg:w-11.5 lg:h-11.5 w-10"
        />
        <h1 className="text-[24px] font-extrabold text-foreground max-xs:hidden ">
          Kan<span className="text-primary-DEFAULT">Flow</span>
        </h1>
        {/* <Show when="signed-in">
          <MobileNavMenu />
        </Show> */}
      </div>
      <div className="actions flex gap-6 items-center max-lg:gap-3">
        <Show when="signed-in">
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

          <CustomDropdownMenu deleted="boardnow" type="Board" />
        </Show>
        <Show when="signed-out">
          <div className="flex gap-6 items-center justify-center">
            <SignInButton>
              <Button
                className=" rounded-full h-15.5 text-[16px] font-medium text-foreground flex-1/3 p-0 "
                variant="ghost"
              >
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className=" bg-primary-DEFAULT px-6 py-3 rounded-full h-12 text-[16px] text-white font-bold  flex-1/7">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </Show>
      </div>
    </header>
  )
}

export default Header
