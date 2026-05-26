import { Columndb } from '@/mocks/column.mock'
import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface Params {
  values: {
    title: string
    color: string
  }
  activeBoardId: number | null | undefined
  currentColumns: Columndb[]
  setColumns: (columns: Columndb[]) => void
  queryClient: QueryClient
}

export async function createColumn({
  values,
  activeBoardId,
  currentColumns,
  setColumns,
  queryClient
}: Params) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/columns`, {
      method: 'POST',
      body: JSON.stringify({ ...values, boardId: activeBoardId }),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    })

    if (!res.ok) {
      setColumns(currentColumns)
      toast.error('Failed to create column', { description: 'The column has been reverted.' })
      return
    }

    const { column }: { column: Columndb } = await res.json()
    setColumns([...currentColumns, column])
    queryClient.invalidateQueries({ queryKey: ['columns', activeBoardId] })
  } catch (error) {
    setColumns(currentColumns)
    toast.error('Failed to create column', { description: 'The column has been reverted.' })
    console.error(error)
  }
}
