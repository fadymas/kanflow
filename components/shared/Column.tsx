import { cn } from '@/lib/utils'
import TaskCard from './TaskCard'
import { Plus } from 'lucide-react'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Task } from '@/mocks/task.model'
import CreateColumn from '../modals/CreateColumn'

interface ColumnProps {
  title?: string
  tasks?: Task[]
  isAddNew?: boolean
  color?: string
  className?: string
}

export default function Column({ title, tasks, isAddNew = false, color, className }: ColumnProps) {
  if (isAddNew) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'min-w-75 min-h-full dark:bg-[rgba(43,44,55,0.5)] bg-[rgba(214,227,249,0.4)] rounded-modal flex flex-col items-center justify-center gap-4  ',
              className
            )}
          >
            <Plus className="text-knetural-default size-5.25! font-bold " />
            <span className="text-[24px] font-bold text-knetural-default text-center leading-8">
              New Column
            </span>
          </Button>
        </DialogTrigger>
        <CreateColumn />
      </Dialog>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6 max-w-75 min-w-75 w-75 min-h-full', className)}>
      <div className="flex items-center gap-3">
        <div className={`w-4 min-h-full rounded-full ring`} style={{ backgroundColor: color }} />
        <h3 className="text-[12px] font-bold text-knetural-default tracking-[0.2em]">
          {title?.toUpperCase()} ({tasks?.length})
        </h3>
      </div>
      <div className="flex flex-col gap-6">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
