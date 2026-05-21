'use client'
import { useState } from 'react'
import BoardDialog from '../app/dialogs/BoardDialog'
import EditTaskDialog from '../app/dialogs/EditTaskDialog'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu'
import { EllipsisVertical, PencilIcon, Plus, TrashIcon } from 'lucide-react'
import { useBoardStore } from '@/providers/board-store-provider'
import DeleteDialog from '../app/dialogs/DeleteDialog'
import { useIsMobile } from '@/hooks/use-mobile'

interface Props {
  type: 'Board' | 'Task'
  id?: number
  deleted?: string
}

function CustomDropdownMenu({ type, id, deleted }: Props) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openAddBoard, setOpenAddBoard] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const isMobile = useIsMobile()

  const setOpenTaskId = useBoardStore((state) => state.setOpenTaskId)
  const activeBoardId = useBoardStore((state) => state.activeBoardID)
  const activeBoardName = useBoardStore((state) => state.activeBoardName)
  const columns = useBoardStore((state) => state.columns) ?? []

  const boardId = id ?? activeBoardId

  if (type == 'Board' && !boardId && !isMobile) {
    return null
  }

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
          {type === 'Board' && isMobile && (
            <DropdownMenuItem
              className="text-primary-DEFAULT dark:text-yellow-500"
              onSelect={() => setOpenAddBoard(true)}
            >
              <Plus className="size-4" />
              Add Board
            </DropdownMenuItem>
          )}

          {boardId && (
            <DropdownMenuItem onSelect={() => setOpenEdit(true)}>
              <PencilIcon className="size-4" />
              {type === 'Board' ? 'Change Name' : 'Edit'}
            </DropdownMenuItem>
          )}

          {boardId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setOpenDelete(true)}>
                <TrashIcon className="size-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Board dialog — outside dropdown */}
      <Dialog open={openAddBoard} onOpenChange={setOpenAddBoard}>
        <BoardDialog onSuccess={() => setOpenAddBoard(false)} />
      </Dialog>

      {/* Edit dialog — outside dropdown */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        {type === 'Board' && openEdit && (
          <BoardDialog
            editId={boardId}
            onSuccess={() => setOpenEdit(false)}
          />
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

      {/* Delete dialog — outside dropdown */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DeleteDialog
          type={type}
          id={id ? id : activeBoardId!}
          deleted={deleted ? deleted : activeBoardName!}
          openCallback={() => setOpenDelete(false)}
        />
      </Dialog>
    </>
  )
}

export default CustomDropdownMenu
