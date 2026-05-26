'use client'

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateBoard } from '@/hooks/board/useCreateBoard'
import { CreateBoardFormUI } from './CreateBoardFormUI'

interface Props {
  onSuccess?: () => void
}

export function CreateBoardDialog({ onSuccess }: Props) {
  const { form, fields, append, remove, onSubmit } = useCreateBoard({ onSuccess })

  return (
    <DialogContent
      className="bg-kpanal modal-content scroll-panal gap-8"
      aria-describedby={undefined}
    >
      <DialogHeader>
        <DialogTitle className="text-foreground bold-20">Add New Board</DialogTitle>
      </DialogHeader>
      <CreateBoardFormUI form={form} onSubmit={onSubmit} fields={fields} append={append} remove={remove} />
    </DialogContent>
  )
}
