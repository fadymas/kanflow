'use client'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../ui/context-menu'
import { Dialog } from '../ui/dialog'
import Delete from '../modals/Delete'
import { useState } from 'react'

interface Props {
  type: 'Column'
  deleted: string
}
function CustomMenuContent({ type, deleted }: Props) {
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
        <Delete type={type} deleted={deleted} openCallback={() => setOpen(!open)} />
      </Dialog>
    </>
  )
}

export default CustomMenuContent
