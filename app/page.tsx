import Column from '@/components/shared/Column'
import { columns } from '@/mocks/column.model'

export default function Home() {
  return (
    <main className="py-8 pl-8 flex gap-8 min-h-full  overflow-x-scroll w-full scroll-container max-lg:pt-8 max-lg:pb-0 max-lg:pl-3 max-lg:gap-4">
      {columns.map((column) => (
        <Column key={column.id} title={column.name} color={column.color} tasks={column.tasks} />
      ))}

      <Column isAddNew />
    </main>
  )
}
