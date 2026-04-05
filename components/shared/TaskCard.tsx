import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { EllipsisVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu'
import { Task } from '@/mocks/task.model'
import ShowTask from '../modals/showTask'

interface TaskCardProps {
  task: Task
  className?: string
}

export default function TaskCard({ task, className }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.isCompleted).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'w-full text-left items-start justify-start bg-kpanal rounded-modal p-4! shadow-[0px_10px_20px_0px_rgba(15,28,44,0.04)]',
            'flex flex-col gap-3 min-h-24.5 h-auto!  cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]',

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
      <DialogContent showCloseButton={false} className="modal-content bg-kpanal gap-5.75">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-lg font-bold text-foreground pr-8 line-clamp-3 text-ellipsis w-10/12">
              {task.title}
            </DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="max-lg:hidden">
                  <EllipsisVertical size={18} className="size-4.5! text-knetural-default" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-kbackground">
                <DropdownMenuItem>
                  <PencilIcon className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <TrashIcon className=" size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>
        <DialogDescription className="text-[14px] text-kdescription  line-clamp-3 text-ellipsis">
          We know what we&apos;re planning to build for version one. Now we need to analyse the
          market and see what the competition is doing and if their pricing model helps us in any
          way.
        </DialogDescription>
        <ShowTask subTasks={task.subtasks} />
      </DialogContent>
    </Dialog>
  )
}
