import { createTask } from '@/app/api/tasks/createTask'
import { Task } from '@/mocks/task.mock'
import { createTaskSchema, type CreateTaskSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useBoardStore } from '@/providers/board-store-provider'

interface UseCreateTaskParams {
  open: boolean
  onSuccess?: () => void
}

export function useCreateTask({ open, onSuccess }: UseCreateTaskParams) {
  const columns = useBoardStore((state) => state.columns)
  const setColumns = useBoardStore((state) => state.setColumns)

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '', description: '', subtasks: [{ title: '' }], column: '' }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subtasks'
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [open, form])

  async function onSubmit(values: CreateTaskSchema) {
    const previousColumns = columns
    const targetColumnId = values.column

    const tempTask: Task = {
      id: `temp-${crypto.randomUUID()}`,
      title: values.title,
      description: values.description,
      columnId: targetColumnId,
      position: (columns!.find((c) => String(c.id) === targetColumnId)?.Task.length ?? 0) + 1,
      createdAt: new Date().toISOString(),
      SubTask: values.subtasks.map((s, i) => ({
        id: `temp-sub-${Date.now()}-${i}`,
        title: s.title,
        taskId: `temp-${Date.now()}`,
        isCompleted: false
      }))
    }

    setColumns(
      columns!.map((col) =>
        String(col.id) == targetColumnId ? { ...col, Task: [...col.Task, tempTask] } : col
      )
    )
    form.reset()
    onSuccess?.()
    toast.success('Task created', { description: `"${values.title}" has been added.` })

    try {
      const task = await createTask(values)
      setColumns(
        previousColumns!.map((col) =>
          String(col.id) == targetColumnId ? { ...col, Task: [...col.Task, task] } : col
        )
      )
    } catch (error) {
      setColumns(previousColumns!)
      toast.error('Failed to create task', { description: 'The task has been reverted.' })
      console.error(error)
    }
  }

  return { form, fields, append, remove, onSubmit, columns }
}
