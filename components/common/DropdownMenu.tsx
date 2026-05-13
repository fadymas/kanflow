'use client'
import { useState } from 'react'
import BoardDialog from '../dialogs/BoardDialog'
import EditTaskDialog from '../dialogs/EditTaskDialog'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu'
import { EllipsisVertical, PencilIcon, Plus, TrashIcon } from 'lucide-react'
import { useBoardStore } from '@/providers/board-store-provider'
import DeleteDialog from '../dialogs/DeleteDialog'

interface Props {
  type: 'Board' | 'Task'
  id?: number
  deleted?: string
}

function CustomDropdownMenu({ type, id, deleted }: Props) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openAddBoard, setOpenAddBoard] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const setOpenTaskId = useBoardStore((state) => state.setOpenTaskId)

  const activeBoard = useBoardStore((state) => state.activeBoard)
  const columns = useBoardStore((state) => state.columns)

  const boardId = id ?? activeBoard?.id

  // Find the task from Zustand columns so we can pre-fill the edit form
  const task =
    type === 'Task' ? columns.flatMap((col) => col.Task).find((t) => Number(t.id) === id) : null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="">
            <EllipsisVertical size={18} className="size-4.5! text-knetural-default" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-kbackground w-35">
          {type === 'Board' && (
            <Dialog open={openAddBoard} onOpenChange={setOpenAddBoard}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="text-primary-DEFAULT md:hidden"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Plus className="size-4" />
                  Add Board
                </DropdownMenuItem>
              </DialogTrigger>
              <BoardDialog onSuccess={() => setOpenAddBoard(false)} />
            </Dialog>
          )}

          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PencilIcon className="size-4" />
                {type === 'Board' ? 'Change Name' : 'Edit'}
              </DropdownMenuItem>
            </DialogTrigger>
            {type === 'Board' && openEdit && (
              <BoardDialog editId={boardId} onSuccess={() => setOpenEdit(false)} />
            )}
            {type === 'Task' && openEdit && task && (
              <EditTaskDialog
                taskId={Number(task.id)}
                title={task.title}
                description={task.description ?? ''}
                onSuccess={() => {
                  setOpenEdit(false)
                  setOpenTaskId(null)
                }}
              />
            )}
          </Dialog>

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setOpenDelete(!openDelete)}>
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DeleteDialog
          type={type}
          id={id ? id : activeBoard?.id}
          deleted={deleted ? deleted : activeBoard?.name}
          openCallback={() => setOpenDelete(false)}
        />
      </Dialog>
    </>
  )
}

export default CustomDropdownMenu
