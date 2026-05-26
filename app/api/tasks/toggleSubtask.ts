export async function toggleSubtask(subTaskId: string, isCompleted: boolean): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sub-tasks`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ subTaskId, isCompleted })
  })

  if (!res.ok) throw new Error('Failed to update subtask')
}
