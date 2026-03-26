import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Pencil, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Task {
  id: string
  title: string
  description?: string
  subtasks?: { completed: number; total: number }
  priority?: 'low' | 'medium' | 'high'
  completed?: boolean
}

interface TaskCardProps {
  task: Task
  className?: string
}

export default function TaskCard({ task, className }: TaskCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'w-full text-left items-start justify-start bg-kpanal rounded-[1rem] p-4! shadow-[0px_10px_20px_0px_rgba(15,28,44,0.04)]',
            'flex flex-col gap-3 min-h-24.5 h-auto!  cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]',
            task.completed && 'opacity-70',
            className
          )}
        >
          <h4
            className={cn(
              'text-[18px] font-bold text-foreground leading-[22.5px] line-clamp-2 text-ellipsis w-full h-auto whitespace-break-spaces',
              task.completed && 'line-through text-[#474552]'
            )}
          >
            {task.title}
          </h4>
          {task.subtasks && (
            <p className="text-[12px] font-bold text-knetural-default">
              {task.subtasks.completed} of {task.subtasks.total} subtasks
            </p>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 rounded-[2rem] p-8">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl font-bold text-neutral-50 pr-8">
              {task.title}
            </DialogTitle>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-[#474552] hover:bg-neutral-800"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-[#474552] hover:bg-neutral-800"
              >
                <Copy size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {task.description && <p className="text-[14px] text-[#474552]">{task.description}</p>}
          {task.subtasks && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-[12px] font-bold text-[#474552] uppercase tracking-wide">
                  Subtasks ({task.subtasks.completed}/{task.subtasks.total})
                </h5>
                <span className="text-[12px] text-[#474552]">
                  {Math.round((task.subtasks.completed / task.subtasks.total) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-DEFAULT rounded-full transition-all duration-300"
                  style={{
                    width: `${(task.subtasks.completed / task.subtasks.total) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
