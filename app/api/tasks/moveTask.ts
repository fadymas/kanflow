export async function moveTask(taskId: string, columnId: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ taskId, columnId })
  })

  if (!res.ok) throw new Error('Failed to move task')
}
