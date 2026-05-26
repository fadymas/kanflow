'use client'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../ui/context-menu'
import { Dialog } from '../ui/dialog'
import { useState } from 'react'
import DeleteDialog from '../app/dialogs/DeleteDialog'
import { EditColumnDialog } from '../app/dialogs/column/EditColumnDialog'

interface Props {
  id: number
  name: string
  color?: string
}
function CustomMenuContent({ id, name }: Props) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  return (
    <>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => setOpenEdit(!openEdit)}>
          <PencilIcon />
          Edit Column
        </ContextMenuItem>
        <ContextMenuSeparator />

        <ContextMenuItem variant="destructive" onSelect={() => setOpenDelete(!openDelete)}>
          <TrashIcon />
          Delete Column
        </ContextMenuItem>
      </ContextMenuContent>
      <Dialog
        open={openDelete}
        onOpenChange={() => {
          setOpenDelete(!openDelete)
        }}
      >
        {openDelete && (
          <DeleteDialog
            type={'Column'}
            deleted={name}
            id={id}
            openCallback={() => setOpenDelete(!openDelete)}
          />
        )}
      </Dialog>

      <Dialog
        open={openEdit}
        onOpenChange={() => {
          setOpenEdit(!openEdit)
        }}
      >
        {openEdit && <EditColumnDialog onSuccess={() => setOpenEdit(!openEdit)} editId={String(id)} />}
      </Dialog>
    </>
  )
}

export default CustomMenuContent
