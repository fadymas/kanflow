'use client'
import { useState } from 'react'
import BoardDialog from '../dialogs/BoardDialog'
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
  const [openRenameBoard, setOpenRenameBoard] = useState(false)

  const activeBoard = useBoardStore((state) => state.activeBoard)

  const boardId = id ?? activeBoard?.id

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

          <Dialog open={openRenameBoard} onOpenChange={setOpenRenameBoard}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PencilIcon className="size-4" />
                {type === 'Board' ? 'Change Name' : 'Edit'}
              </DropdownMenuItem>
            </DialogTrigger>
            {type === 'Board' && openRenameBoard && (
              <BoardDialog editId={boardId} onSuccess={() => setOpenRenameBoard(false)} />
            )}
          </Dialog>

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setOpenDelete(!openDelete)}>
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={openDelete}
        onOpenChange={() => {
          setOpenDelete(!openDelete)
        }}
      >
        <DeleteDialog
          type={type}
          id={id ? id : activeBoard?.id}
          deleted={deleted ? deleted : activeBoard?.name}
          openCallback={() => setOpenDelete(!openDelete)}
        />
      </Dialog>
    </>
  )
}

export default CustomDropdownMenu
