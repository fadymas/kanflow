import { editTask } from '@/app/api/tasks/editTask'
import { Task } from '@/mocks/task.mock'
import { editTaskSchema, type EditTaskSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useBoardStore } from '@/providers/board-store-provider'

interface UseEditTaskParams {
  taskId: number
  title: string
  description: string
  onSuccess?: () => void
}

export function useEditTask({ taskId, title, description, onSuccess }: UseEditTaskParams) {
  const columns = useBoardStore((state) => state.columns)
  const setColumns = useBoardStore((state) => state.setColumns)

  const form = useForm<EditTaskSchema>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: { title, description }
  })

  async function onSubmit(values: EditTaskSchema) {
    const previousColumns = columns

    setColumns(
      columns!.map((col) => ({
        ...col,
        Task: col.Task.map((t) =>
          t.id == String(taskId)
            ? { ...t, title: values.title, description: values.description }
            : t
        )
      }))
    )

    onSuccess?.()
    toast.success('Task updated', { description: `"${values.title}" has been saved.` })

    try {
      const task: Task = await editTask(taskId, values)
      setColumns(
        columns!.map((col) => ({
          ...col,
          Task: col.Task.map((t) => (t.id == String(taskId) ? task : t))
        }))
      )
    } catch (error) {
      setColumns(previousColumns!)
      toast.error('Failed to update task', { description: 'The changes have been reverted.' })
      console.error(error)
    }
  }

  return { form, onSubmit }
}
