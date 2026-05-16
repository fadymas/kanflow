import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

async function Welcome() {
  return (
    <div className="flex justify-center items-center w-full flex-col gap-4 ">
      <Image
        width={96}
        height={96}
        src="/logo.png"
        alt="logo"
        loading="eager"
        className="w-24 h-auto"
      />
      <h2 className="font-extrabold text-[48px] text-foreground text-center">
        Welcome to <span className="text-primary-DEFAULT">KanFlow</span>
      </h2>
      <p className="text-[20px] text-knetural-default  max-w-127.5 text-center">
        Experience a serne, premium environment for project clarity. Please sign in to start
        managing your boards.
      </p>
      <div className="flex gap-4">
        <SignInButton>
          <Button className="bg-primary-DEFAULT px-10 py-4 rounded-full h-15.5 text-[18px] font-bold text-white flex-1/3">
            Sign in
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button className=" px-10 py-4 rounded-full h-15.5 text-[18px] font-bold  flex-1/7">
            Get Started
          </Button>
        </SignUpButton>
      </div>
    </div>
  )
}

export default Welcome
