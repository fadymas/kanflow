'use client'

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ColumnFormUI } from './ColumnFormUI'
import { useEditColumn } from '../../../../hooks/column/useEditColumn'

interface Props {
  editId: string
  onSuccess?: () => void
}

export function EditColumnDialog({ editId, onSuccess }: Props) {
  const { form, onSubmit } = useEditColumn({ editId, onSuccess })

  return (
    <DialogContent aria-describedby={undefined} className="modal-content gap-8 bg-kpanal">
      <DialogHeader>
        <DialogTitle className="bold-20 text-foreground">Edit Column</DialogTitle>
      </DialogHeader>
      <ColumnFormUI form={form} onSubmit={onSubmit} isEditMode />
    </DialogContent>
  )
}
