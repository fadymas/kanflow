'use client'

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEditTask } from '@/hooks/task/useEditTask'
import { EditTaskFormUI } from './EditTaskFormUI'

interface Props {
  taskId: number
  title: string
  description: string
  onSuccess: () => void
}

export default function EditTaskDialog({ taskId, title, description, onSuccess }: Props) {
  const { form, onSubmit } = useEditTask({ taskId, title, description, onSuccess })

  return (
    <DialogContent className="bg-kpanal modal-content gap-8" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="text-foreground bold-20">Edit Task</DialogTitle>
      </DialogHeader>
      <EditTaskFormUI form={form} onSubmit={onSubmit} />
    </DialogContent>
  )
}
