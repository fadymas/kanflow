import { getColumns } from '@/app/api/boards/getColumns'
import { Columndb } from '@/mocks/column.mock'
import { useBoardStore } from '@/providers/board-store-provider'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

function useBoardColumns() {
  const activeBoard = useBoardStore((s) => s.activeBoardID)
  const setColumns = useBoardStore((s) => s.setColumns)
  const columns = useBoardStore((s) => s.columns)

  const queryKey = ['columns', activeBoard]
  const {
    data: serverColumns = [],
    isLoading,
    isFetching
  } = useQuery<Columndb[]>({
    queryKey,
    queryFn: () => getColumns(activeBoard),
    enabled: !!activeBoard && activeBoard != 0
  })

  useEffect(() => {
    setColumns(serverColumns)
  }, [serverColumns, setColumns])

  return { activeBoard, columns, isLoading, isFetching, queryKey, setColumns }
}

export default useBoardColumns
