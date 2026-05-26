'use client'

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEditBoard } from '@/hooks/board/useEditBoard'
import { EditBoardFormUI } from './EditBoardFormUI'

interface Props {
  editId: number
  onSuccess?: () => void
}

export function EditBoardDialog({ editId, onSuccess }: Props) {
  const { form, onSubmit } = useEditBoard({ editId, onSuccess })

  return (
    <DialogContent
      className="bg-kpanal modal-content scroll-panal gap-8"
      aria-describedby={undefined}
    >
      <DialogHeader>
        <DialogTitle className="text-foreground bold-20">Change Board Name</DialogTitle>
      </DialogHeader>
      <EditBoardFormUI form={form} onSubmit={onSubmit} />
    </DialogContent>
  )
}
