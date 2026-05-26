'use client'

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateTask } from '@/hooks/task/useCreateTask'
import { CreateTaskFormUI } from './CreateTaskFormUI'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CreateTaskDialog({ open, setOpen }: Props) {
  const { form, fields, append, remove, onSubmit, columns } = useCreateTask({
    open,
    onSuccess: () => setOpen(false)
  })

  return (
    <DialogContent
      aria-describedby={undefined}
      className="rounded-modal modal-content scroll-panal bg-kpanal gap-8"
    >
      <DialogHeader>
        <DialogTitle className="bold-20 text-foreground">Add New Task</DialogTitle>
      </DialogHeader>
      <CreateTaskFormUI
        form={form}
        onSubmit={onSubmit}
        fields={fields}
        append={append}
        remove={remove}
        columns={columns}
      />
    </DialogContent>
  )
}
