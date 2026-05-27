import { SignInButton, SignUpButton, Show } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { version } from '@/package.json'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home'
}

export default function MarketingPage() {
  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <main className="relative flex items-center justify-center overflow-hidden w-full min-h-[calc(100dvh-4rem)]">
        {/* Radial glow background — purple in dark, soft indigo in light */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-10"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, var(--color-primary-700) 0%, transparent 70%)'
          }}
        />

        <div className="relative z-10 mx-auto w-full  lg:px-27.5   px-2 py-3.5 my-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* ── Left column: copy ──────────────────────────────────── */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-kborder bg-kpanal px-3.5 py-1.5">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[1.2px] text-primary-DEFAULT dark:text-yellow-500">
                  New Version {version}
                </span>
              </div>

              {/* Heading */}
              <h1 className="mb-6 font-bold text-[40px] sm:text-[48px] leading-[1.2] tracking-[-0.02em] text-kforeground max-lg:text-center">
                Simplified <span className="text-primary-DEFAULT dark:text-yellow-500">Task</span>
                <br />
                <span className="text-primary-DEFAULT dark:text-yellow-500">Management</span>
              </h1>

              {/* Description */}
              <p className="mb-10 max-w-lg text-[17px] sm:text-[18px] leading-[1.7] dark:text-neutral-700 text-neutral-300 max-lg:text-center">
                A real-time Kanban demo featuring drag-and-drop tasks, board organization, and
                secure authentication. Experience the workflow designed for high-performance teams.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <Show when="signed-out">
                  <SignUpButton>
                    <Button className="inline-flex items-center gap-2 rounded-[12px] bg-primary-DEFAULT hover:bg-primary-400 dark:bg-yellow-500 dark:hover:bg-yellow-400  text-white text-[18px] sm:text-[20px] font-semibold px-8 sm:px-10 py-4 h-auto transition-colors">
                      Get Started
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="shrink-0"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </SignUpButton>
                  <SignInButton>
                    <Button
                      variant="outline"
                      className="rounded-[12px] border-kborder dark:border-[#474553] text-kforeground text-[18px] sm:text-[20px] font-semibold px-8 sm:px-10 py-4 h-auto bg-transparent hover:bg-ksubtle transition-colors"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <Link href="/board">
                    <Button className="inline-flex items-center gap-2 rounded-[12px] bg-primary-DEFAULT hover:bg-primary-400 dark:bg-yellow-500 dark:hover:bg-yellow-400  text-white text-[18px] sm:text-[20px] font-semibold px-8 sm:px-10 py-4 h-auto transition-colors">
                      Go to Dashboard
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="shrink-0"
                      >
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
            </div>

            {/* ── Right column: Kanban mockup ────────────────────────── */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end mt-10 lg:mt-0">
              <div className="relative w-full max-w-120">
                {/* Decorative glow behind the card */}
                <div
                  className="pointer-events-none absolute inset-[-10%] opacity-20 dark:opacity-15 blur-[32px] rounded-full"
                  style={{
                    background:
                      'linear-gradient(33deg, var(--color-primary-700) 0%, transparent 50%, var(--color-tertiary-400) 100%)'
                  }}
                />

                {/* Glassmorphism card */}
                <div className="relative rounded-[12px] border border-kborder dark:border-[rgba(71,69,83,0.3)] bg-kpanal/80 dark:bg-[rgba(32,31,32,0.4)] backdrop-blur-[6px] p-5 sm:p-6 shadow-2xl overflow-hidden">
                  {/* Corner glows */}
                  <div className="pointer-events-none absolute -bottom-10 -right-10 size-40 rounded-full bg-primary-700/10 dark:bg-[rgba(197,192,255,0.1)] blur-2xl" />
                  <div className="pointer-events-none absolute -top-10 -left-10 size-40 rounded-full bg-tertiary-400/5 dark:bg-[rgba(246,190,57,0.05)] blur-2xl" />

                  {/* Mock Kanban board */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* TO DO column */}
                    <div className="flex flex-col gap-3">
                      <p className="font-mono text-[11px] font-medium tracking-[0.6px] text-kdescription uppercase">
                        To Do
                      </p>
                      <div className="rounded-[8px] border border-kborder/50 dark:border-[rgba(71,69,83,0.5)] bg-ksubtle dark:bg-[#201f20] p-3 opacity-80 flex flex-col gap-2 h-20">
                        <div className="h-2 w-3/4 rounded-full bg-primary-DEFAULT/20 dark:bg-[rgba(197,192,255,0.2)]" />
                        <div className="h-2 w-full rounded-full bg-kborder dark:bg-[rgba(200,196,213,0.1)]" />
                      </div>
                      <div className="rounded-[8px] border border-kborder/50 dark:border-[rgba(71,69,83,0.5)] bg-ksubtle dark:bg-[#201f20] p-3 flex flex-col gap-2 h-20">
                        <div className="h-2 w-1/2 rounded-full bg-primary-DEFAULT/40 dark:bg-[rgba(197,192,255,0.4)]" />
                        <div className="h-2 w-4/5 rounded-full bg-kborder dark:bg-[rgba(200,196,213,0.1)]" />
                      </div>
                    </div>

                    {/* IN PROGRESS column */}
                    <div className="flex flex-col gap-3">
                      <p className="font-mono text-[11px] font-medium tracking-[0.6px] text-kdescription uppercase">
                        In Progress
                      </p>
                      <div className="relative rounded-[8px] border border-primary-DEFAULT/40 dark:border-[rgba(197,192,255,0.4)] bg-kpanal dark:bg-[#2a2a2b] p-3 flex flex-col gap-2 h-20 shadow-[0_10px_15px_-3px_rgba(99,95,199,0.08)]">
                        <div className="h-2 w-4/5 rounded-full bg-primary-DEFAULT dark:bg-[#c5c0ff]" />
                        <div className="h-2 w-1/2 rounded-full bg-kborder dark:bg-[rgba(200,196,213,0.1)]" />
                      </div>
                    </div>

                    {/* DONE column */}
                    <div className="flex flex-col gap-3">
                      <p className="font-mono text-[11px] font-medium tracking-[0.6px] text-kdescription uppercase">
                        Done
                      </p>
                      <div className="rounded-[8px] border border-kborder/50 dark:border-[rgba(71,69,83,0.5)] bg-ksubtle dark:bg-[#201f20] p-3 opacity-40 flex flex-col gap-2 h-20">
                        <div className="h-2 w-1/2 rounded-full bg-tertiary-400/40 dark:bg-[rgba(246,190,57,0.4)]" />
                        <div className="h-2 w-full rounded-full bg-kborder dark:bg-[rgba(200,196,213,0.1)]" />
                      </div>
                      <div className="rounded-[8px] border border-kborder/50 dark:border-[rgba(71,69,83,0.5)] bg-ksubtle dark:bg-[#201f20] p-3 opacity-40 flex flex-col gap-2 h-20">
                        <div className="h-2 w-3/4 rounded-full bg-tertiary-400/40 dark:bg-[rgba(246,190,57,0.4)]" />
                        <div className="h-2 w-4/5 rounded-full bg-kborder dark:bg-[rgba(200,196,213,0.1)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
