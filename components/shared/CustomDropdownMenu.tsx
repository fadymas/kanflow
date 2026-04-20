'use client'
import { useState } from 'react'
import CreateBoard from '../modals/CreateBoardDialog'
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
import DeleteDialog from '../modals/DeleteDialog'

interface Props {
  type: 'Board' | 'Task'
  id?: number
  deleted?: string
}

function CustomDropdownMenu({ type, id, deleted }: Props) {
  const [open, setOpen] = useState(false)
  const [openAddBoard, setOpenAddBoard] = useState(false)

  const activeBoard = useBoardStore((state) => state.activeBoard)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="">
            <EllipsisVertical size={18} className="size-4.5! text-knetural-default" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-kbackground">
          {type === 'Board' && (
            <Dialog open={openAddBoard} onOpenChange={setOpenAddBoard}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="text-primary-DEFAULT md:hidden"
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  <Plus className="size-4" />
                  Add Board
                </DropdownMenuItem>
              </DialogTrigger>
              <CreateBoard onSuccess={() => setOpen(false)} />
            </Dialog>
          )}

          <DropdownMenuItem>
            <PencilIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setOpen(!open)}>
            <TrashIcon className=" size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open)
        }}
      >
        <DeleteDialog
          type={type}
          id={id ? id : activeBoard?.id}
          deleted={deleted ? deleted : activeBoard?.name}
          openCallback={() => setOpen(!open)}
        />
      </Dialog>
    </>
  )
}

export default CustomDropdownMenu
