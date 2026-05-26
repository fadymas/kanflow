import { RenameBoardSchema } from '@/lib/validation'

export async function editBoard(values: RenameBoardSchema): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`, {
    method: 'PATCH',
    body: JSON.stringify(values),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
  })

  if (!res.ok) throw new Error('Failed to rename board')
}
