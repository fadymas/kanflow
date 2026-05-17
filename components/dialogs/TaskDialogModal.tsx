'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import TaskDialogActions from './TaskDialogActions'
import DropdownMenu from '../common/DropdownMenu'
import { useBoardStore } from '@/providers/board-store-provider'

export default function TaskDialogModal() {
  const openTaskId = useBoardStore((state) => state.openTaskId)
  const setOpenTaskId = useBoardStore((state) => state.setOpenTaskId)
  const columns = useBoardStore((state) => state.columns) ?? []

  const task = columns.flatMap((col) => col.Task).find((t) => t?.id === openTaskId)

  if (!task) return null

  return (
    <Dialog open={!!openTaskId} onOpenChange={(open) => setOpenTaskId(open ? openTaskId : null)}>
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
            <DropdownMenu deleted={task.title} type="Task" id={Number(task.id)} />
          </div>
        </DialogHeader>
        <DialogDescription className="text-[14px] text-kdescription line-clamp-3 text-ellipsis">
          {task.description}
        </DialogDescription>
        <TaskDialogActions taskId={task.id} subTasks={task.SubTask} columnId={task.columnId} />
      </DialogContent>
    </Dialog>
  )
}
