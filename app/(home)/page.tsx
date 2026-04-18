import Board from '@/components/shared/Board'
import Welcome from '@/components/layout/Welcome'

import { Show } from '@clerk/nextjs'

export default async function Home() {
  return (
    <main className="py-8 pl-8 flex gap-8 min-h-full  overflow-x-scroll w-full scroll-container max-lg:pt-8 max-lg:pb-0 max-lg:px-3 max-lg:gap-4">
      <Show when="signed-in" fallback={<Welcome />}>
        <Board />
      </Show>
    </main>
  )
}
