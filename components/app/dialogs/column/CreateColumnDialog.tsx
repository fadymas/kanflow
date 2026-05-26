'use client'

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ColumnFormUI } from './ColumnFormUI'
import { useCreateColumn } from '../../../../hooks/column/useCreateColumn'

interface Props {
  onSuccess?: () => void
}

export function CreateColumnDialog({ onSuccess }: Props) {
  const { form, onSubmit } = useCreateColumn({ onSuccess })

  return (
    <DialogContent aria-describedby={undefined} className="modal-content gap-8 bg-kpanal">
      <DialogHeader>
        <DialogTitle className="bold-20 text-foreground">Create New Column</DialogTitle>
      </DialogHeader>
      <ColumnFormUI form={form} onSubmit={onSubmit} />
    </DialogContent>
  )
}
