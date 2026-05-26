import Image from 'next/image'
// import MobileNavMenu from './MobileNavMenu'
import CustomDropdownMenu from '../../common/DropdownMenu'
import { Show } from '@clerk/nextjs'
import CreateTask from '../dialogs/task/CreateTask'
import Link from 'next/link'

async function Header() {
  return (
    <header className="flex items-center justify-between  lg:px-12 h-16  px-2 py-3.5  k-panal border-b border-kborder shadow-">
      <Link href="/">
        <div className="logo flex justify-center items-center gap-3 ">
          <Image
            src="/logo.png"
            alt="Logo"
            loading="eager"
            width={32}
            height={32}
            className="w-10 h-auto lg:w-8"
          />
          <h1 className="text-[24px] font-bold text-foreground max-xs:hidden ">
            Kan<span className="text-primary-DEFAULT dark:text-yellow-500">Flow</span>
          </h1>
        </div>
      </Link>
      <div className="actions flex gap-6 items-center max-lg:gap-3">
        <Show when="signed-in">
          <CreateTask />
          <CustomDropdownMenu type="Board" />
        </Show>
      </div>
    </header>
  )
}

export default Header
