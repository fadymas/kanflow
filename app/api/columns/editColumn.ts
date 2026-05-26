import { Columndb } from '@/mocks/column.mock'
import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface Params {
  values: {
    title: string
    color: string
  }
  activeBoardId: number | null | undefined
  editId: string
  previousColumns: Columndb[]
  setColumns: (columns: Columndb[]) => void
  queryClient: QueryClient
}

export async function editColumn({
  values,
  activeBoardId,
  editId,
  previousColumns,
  setColumns,
  queryClient
}: Params) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/columns`, {
      method: 'PATCH',
      body: JSON.stringify({ columnId: editId, name: values.title, color: values.color }),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    })

    if (!res.ok) {
      setColumns(previousColumns)
      toast.error('Failed to update column', { description: 'The change has been reverted.' })
      return
    }

    queryClient.invalidateQueries({ queryKey: ['columns', activeBoardId] })
  } catch (error) {
    setColumns(previousColumns)
    toast.error('Failed to update column', { description: 'The change has been reverted.' })
    console.error(error)
  }
}
