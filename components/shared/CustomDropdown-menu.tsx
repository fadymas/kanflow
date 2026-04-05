'use client'
import CreateBoard from '../modals/CreateBoard'
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
  isBoard?: boolean
}

function CustomDropdownMenu({ isBoard }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="">
          <EllipsisVertical size={18} className="size-4.5! text-knetural-default" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-kbackground">
        {isBoard && (
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
        <DropdownMenuItem variant="destructive">
          <TrashIcon className=" size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CustomDropdownMenu
