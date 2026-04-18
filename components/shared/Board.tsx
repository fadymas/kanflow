'use client'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import Column from './Column'
import { useBoardStore } from '@/providers/board-store-provider'
import { Columndb } from '@/mocks/column.model'
import { useQuery } from '@tanstack/react-query'
function Board() {
  const activeBoardId = useBoardStore((s) => s.activeBoardId)
  const { data: columns = [], isLoading } = useQuery({
    queryKey: ['columns', activeBoardId],
    queryFn: () =>
      fetch(`/api/columns?boardId=${activeBoardId}`)
        .then((res) => res.json())
        .then((data) => data.columns ?? []),
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
            tasks={column.tasks}
          />
        ))}
      </DragDropContext>
      <Column isAddNew />
    </>
  )
}

export default Board
