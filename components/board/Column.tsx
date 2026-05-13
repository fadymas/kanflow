'use client'
import { cn } from '@/lib/utils'
import TaskCard from './TaskCard'
import { Plus } from 'lucide-react'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { ContextMenu, ContextMenuTrigger } from '../ui/context-menu'
import CustomMenuContent from '../common/MenuContent'
import { Droppable } from '@hello-pangea/dnd'
import { Task } from '@/mocks/task.mock'
import { useState } from 'react'
import ColumnDialog from '../dialogs/ColumnDialog'

interface ColumnProps {
  id?: string
  title?: string
  tasks?: Task[]
  isAddNew?: boolean
  color?: string
  className?: string
}

export default function Column({
  id,
  title,
  tasks,
  isAddNew = false,
  color,
  className
}: ColumnProps) {
  const [open, setOpen] = useState(false)
  if (isAddNew) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
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
        {open && <ColumnDialog onSuccess={() => setOpen(false)} />}
      </Dialog>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6 max-w-75 min-w-75 w-75 min-h-full', className)}>
      <div className="flex items-center gap-3">
        <div className={`w-4 min-h-full rounded-full ring`} style={{ backgroundColor: color }} />
        <div className="flex">
          <h3 className="text-[12px] font-bold text-knetural-default tracking-[0.2em] line-clamp-1 max-w-37.5">
            {title?.toUpperCase()}
          </h3>
          <h3 className="text-[12px] font-bold text-knetural-default tracking-[0.2em]">
            ({tasks?.length || 0})
          </h3>
        </div>
      </div>
      <ContextMenu>
        <ContextMenuTrigger className="h-full">
          <Droppable droppableId={String(id!)} type="COLUMN">
            {(provided, snapshot) => (
              <div
                className={`flex flex-col gap-6 h-full rounded-md  ${snapshot.isDraggingOver ? 'bg-kpanal/50' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks?.map((task) => (
                  <TaskCard key={task.id} task={task} index={Number(task.position)} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ContextMenuTrigger>
        <CustomMenuContent id={Number(id)} name={title || 'Unnamed Column'} />
      </ContextMenu>
    </div>
  )
}
