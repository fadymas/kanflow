'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Draggable } from '@hello-pangea/dnd'
import { Task } from '@/mocks/task.mock'
import { useBoardStore } from '@/providers/board-store-provider'

interface TaskCardProps {
  index: number
  task: Task
  className?: string
}

export default function TaskCard({ index, task, className }: TaskCardProps) {
  const completedSubtasks = task.SubTask.filter((subtask) => subtask.isCompleted).length
  const setOpenTaskId = useBoardStore((state) => state.setOpenTaskId)

  return (
    <Draggable draggableId={String(task.id)} index={index} disableInteractiveElementBlocking>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="relative"
          style={provided.draggableProps.style}
        >
          <div
            {...provided.dragHandleProps}
            className="absolute right-5 top-1/2 -translate-y-1/2 cursor-grab z-10"
          >
            ⋮⋮
          </div>
          <Button
            onClick={() => setOpenTaskId(task.id)}
            className={cn(
              'w-full text-left items-start justify-start bg-kpanal rounded-modal p-4! shadow-[0px_10px_20px_0px_rgba(15,28,44,0.04)]',
              'flex flex-col gap-3 min-h-24.5 h-auto!  cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]',
              snapshot.isDragging ? 'ring-1 ring-foreground' : '',
              className
            )}
          >
            <h4
              className={cn(
                'text-[18px] font-bold text-foreground leading-[22.5px] line-clamp-2 text-ellipsis w-full h-auto whitespace-break-spaces'
              )}
            >
              {task.title}
            </h4>
            {task.SubTask && (
              <p className="text-[12px] font-bold text-knetural-default">
                {completedSubtasks} of {task.SubTask.length} subtasks
              </p>
            )}
          </Button>
        </div>
      )}
    </Draggable>
  )
}
