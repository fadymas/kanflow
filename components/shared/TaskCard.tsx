import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Task } from '@/mocks/task.model'
import ShowTask from '../modals/showTask'
import CustomDropdownMenu from './CustomDropdown-menu'
import { Draggable } from '@hello-pangea/dnd'

interface TaskCardProps {
  index: number
  task: Task
  className?: string
}

export default function TaskCard({ index, task, className }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.isCompleted).length

  return (
    <Draggable draggableId={task.id} index={index} disableInteractiveElementBlocking>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
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
                {task.subtasks && (
                  <p className="text-[12px] font-bold text-knetural-default">
                    {completedSubtasks} of {task.subtasks.length} subtasks
                  </p>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent
              aria-describedby={undefined}
              showCloseButton={false}
              className="modal-content bg-kpanal gap-5.75"
            >
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <DialogTitle className="text-lg font-bold text-foreground pr-8 line-clamp-3 text-ellipsis w-10/12">
                    {task.title}
                  </DialogTitle>
                  <CustomDropdownMenu deleted={task.title} type="Task" />
                </div>
              </DialogHeader>
              <DialogDescription className="text-[14px] text-kdescription  line-clamp-3 text-ellipsis">
                We know what we&apos;re planning to build for version one. Now we need to analyse
                the market and see what the competition is doing and if their pricing model helps us
                in any way.
              </DialogDescription>
              <ShowTask subTasks={task.subtasks} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Draggable>
  )
}
