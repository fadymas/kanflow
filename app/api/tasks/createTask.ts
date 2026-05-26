import { CreateTaskSchema } from '@/lib/validation'
import { Task } from '@/mocks/task.mock'

export async function createTask(values: CreateTaskSchema): Promise<Task> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
  })

  if (!res.ok) throw new Error('Failed to create task')

  const data = await res.json()
  return data.task
}
