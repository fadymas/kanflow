'use client'
import { useState } from 'react'
import CreateBoard from '../modals/CreateBoard'
import Delete from '../modals/Delete'
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

interface Props {
  type: 'Board' | 'Task'
  deleted: string
}

function CustomDropdownMenu({ type, deleted }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="">
          <EllipsisVertical size={18} className="size-4.5! text-knetural-default" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-kbackground">
        {type === 'Board' && (
          <Dialog>
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
            <CreateBoard />
          </Dialog>
        )}

        <DropdownMenuItem>
          <PencilIcon className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Dialog
          open={open}
          onOpenChange={() => {
            setOpen(!open)
          }}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
              <TrashIcon className=" size-4" />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
          <Delete type={type} deleted={deleted} openCallback={() => setOpen(!open)} />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CustomDropdownMenu
