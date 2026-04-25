'use client'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Column from './Column'
import TaskDialogModal from '../dialogs/TaskDialogModal'
import { useBoardStore } from '@/providers/board-store-provider'
import { Columndb } from '@/mocks/column.mock'

function Board() {
  const activeBoard = useBoardStore((s) => s.activeBoard)
  const setColumns = useBoardStore((s) => s.setColumns)
  const storedColumns = useBoardStore((s) => s.columns)

  const {
    data: columns = [],
    isLoading,
    status
  } = useQuery({
    queryKey: ['columns', activeBoard?.id],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/columns?boardId=${activeBoard?.id}`)
        .then((res) => res.json())
        .then((data) => data.columns ?? []),
    enabled: !!activeBoard?.id
  })

  useEffect(() => {
    setColumns(columns)
  }, [columns, setColumns])

  function onDragEnd(result: DropResult) {
    console.log(result)
  }

  if (status === 'pending' || isLoading) {
    return <div>Loading....</div>
  }

  return (
    <>
      <TaskDialogModal />
      <DragDropContext onDragEnd={onDragEnd}>
        {storedColumns.map((column: Columndb) => (
          <Column
            key={column.id}
            id={column.id}
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
