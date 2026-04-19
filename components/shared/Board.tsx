'use client'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import Column from './Column'
import { useBoardStore } from '@/providers/board-store-provider'
import { Columndb } from '@/mocks/column.model'
import { useQuery } from '@tanstack/react-query'
function Board() {
  const activeBoardId = useBoardStore((s) => s.activeBoardId)
  const setColumns = useBoardStore((s) => s.setColumns)

  const { data: columns = [], isLoading } = useQuery({
    queryKey: ['columns', activeBoardId],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/columns?boardId=${activeBoardId}`)
        .then((res) => res.json())
        .then((data) => {
          const cols = data.columns ?? []
          setColumns(cols) // save to store
          return cols
        }),
    enabled: !!activeBoardId
  })

  console.log(columns)
  function onDragEnd(result: DropResult) {
    // optimistic reorder logic here later
    console.log(result)
  }

  if (isLoading) {
    return <div>Loading....</div>
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column: Columndb) => (
          <Column
            key={column.id}
            id={String(column.id)}
            title={column.name}
            color={column.color}
            tasks={column.Task}
          />
        ))}
      </DragDropContext>
      <Column isAddNew />
    </>
  )
}

export default Board
