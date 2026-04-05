import Column from '@/components/shared/Column'
import { columns } from '@/mocks/column.model'

export default function Home() {
  return (
    <main className="py-8 pl-8 flex gap-8 min-h-full  overflow-x-scroll w-full scroll-container">
      {columns.map((column) => (
        <Column key={column.id} title={column.name} color={column.color} tasks={column.tasks} />
      ))}

      <Column isAddNew />
    </main>
  )
}
