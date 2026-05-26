import { EditTaskSchema } from '@/lib/validation'
import { Task } from '@/mocks/task.mock'

export async function editTask(taskId: number, values: EditTaskSchema): Promise<Task> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ taskId, ...values })
  })

  if (!res.ok) throw new Error('Failed to update task')

  const data = await res.json()
  return data.task
}
