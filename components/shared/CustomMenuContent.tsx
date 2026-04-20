'use client'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../ui/context-menu'
import { Dialog } from '../ui/dialog'
import { useState } from 'react'
import DeleteDialog from '../modals/DeleteDialog'

interface Props {
  type: 'Column'
  id: number
  deleted: string
}
function CustomMenuContent({ type, id, deleted }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ContextMenuContent>
        <ContextMenuItem>
          <PencilIcon />
          Edit Column
        </ContextMenuItem>
        <ContextMenuSeparator />

        <ContextMenuItem variant="destructive" onSelect={() => setOpen(!open)}>
          <TrashIcon />
          Delete Column
        </ContextMenuItem>
      </ContextMenuContent>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open)
        }}
      >
        <DeleteDialog type={type} deleted={deleted} id={id} openCallback={() => setOpen(!open)} />
      </Dialog>
    </>
  )
}

export default CustomMenuContent
