import { CreateBoardSchema } from '@/lib/validation'
import { Board } from '@/mocks/board.mock'

export async function createBoard(values: CreateBoardSchema): Promise<Board> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/boards`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
  })

  if (!res.ok) throw new Error('Failed to create board')

  const data = await res.json()
  return data.board
}
