import SwitchDualIconLabelDemo from '@/components/vendor/shadcn-studio/switch/switch-11'
import Link from 'next/link'
import { Show, SignInButton, SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between h-16 lg:px-27.5   px-5 py-3.5 k-panal border-b border-kborder shadow-sm">
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
          <SwitchDualIconLabelDemo />
          <Show when="signed-out">
            <div className="flex gap-6 items-center justify-center">
              <SignInButton>
                <Button
                  className="  h-9 w-18.5 text-[14px] font-medium text-foreground flex-1/3 p-0  max-lg:hidden"
                  variant="ghost"
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className=" bg-primary-DEFAULT dark:bg-yellow-500/80 px-6 py-3 rounded-[8px] h-9  text-[14px] text-white font-medium  flex-1/7">
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <Link href="/board">
              <Button className=" bg-primary-DEFAULT dark:bg-yellow-500 px-6 py-3 rounded-[8px] h-9  text-[14px] text-white font-medium  flex-1/7">
                Dashboard{' '}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Link>
          </Show>
        </div>
      </header>
      {children}
      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t  k-panal  border-kborder shadow-sm">
        <div className="mx-auto lg:px-27.5   px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand + copyright */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="KanFlow logo" width={24} height={24} className="size-6" />
              <span className="font-bold text-[22px] text-kforeground">
                Kan<span className="text-primary-DEFAULT dark:text-yellow-500">Flow</span>
              </span>
            </div>
            <p className="font-mono text-[11px] font-medium tracking-[0.6px] dark:text-neutral-700 text-neutral-300">
              © {new Date().getFullYear()} KanbanFlow. Built by Fady Mahrous.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default layout
