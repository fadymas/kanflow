import Board from '@/components/app/Board'
import { Show } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Board',
  description: 'Manage your Kanban boards and tasks. Drag, drop, and organize your workflow.'
}

export default async function Home() {
  return (
    <main className="py-8 pl-8 flex gap-8 min-h-full overflow-x-scroll w-full scroll-container max-lg:pt-8 max-lg:pb-0 max-lg:px-3 max-lg:gap-4">
      <Show when="signed-in">
        <Board />
      </Show>
    </main>
  )
}
