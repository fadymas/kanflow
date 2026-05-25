'use client'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import Column from './Column'
import TaskDialogModal from './dialogs/TaskDialogModal'
import { useBoardStore } from '@/providers/board-store-provider'
import { Columndb } from '@/mocks/column.mock'
import { ColumnSkeleton } from './skeletons'
import Image from 'next/image'

function Board() {
  const activeBoard = useBoardStore((s) => s.activeBoardID)
  const setColumns = useBoardStore((s) => s.setColumns)
  const columns = useBoardStore((s) => s.columns)

  const queryClient = useQueryClient()
  const queryKey = ['columns', activeBoard]
  const {
    data: serverColumns = [],
    isLoading,
    isFetching
  } = useQuery<Columndb[]>({
    queryKey,
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/columns?boardId=${activeBoard}`)
        .then((res) => res.json())
        .then((data) => data.columns ?? []),
    enabled: !!activeBoard && activeBoard != 0
  })

  useEffect(() => {
    setColumns(serverColumns)
  }, [serverColumns, setColumns])

  function onDragEnd(result: DropResult) {
    if (
      !result.destination ||
      !result.source.droppableId ||
      !result.destination.droppableId ||
      !result.draggableId
    )
      return

    const isSameColumn = result.source.droppableId === result.destination.droppableId
    const samePosition = result.source.index === result.destination.index

    if (isSameColumn && samePosition) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    const previousColumns = columns

    const nextColumns = columns?.map((col) => {
      if (isSameColumn) {
        if (col.id == result.source.droppableId) {
          const newTasks = Array.from(col.Task)
          const [movedTask] = newTasks.splice(sourceIndex, 1)
          newTasks.splice(destinationIndex, 0, movedTask)
          return { ...col, Task: newTasks.map((t, i) => ({ ...t, position: i + 1 })) }
        }
      } else {
        if (col.id == result.source.droppableId) {
          const newTasks = Array.from(col.Task)
          newTasks.splice(sourceIndex, 1)
          return { ...col, Task: newTasks.map((t, i) => ({ ...t, position: i + 1 })) }
        }
        if (col.id == result.destination?.droppableId) {
          const sourceCol = columns.find((c) => c.id == result.source.droppableId)
          const movedTask = sourceCol?.Task[sourceIndex]
          if (!movedTask) return col
          const newTasks = Array.from(col.Task)
          newTasks.splice(destinationIndex, 0, { ...movedTask })
          return { ...col, Task: newTasks.map((t, i) => ({ ...t, position: i + 1 })) }
        }
      }
      return col
    })

    setColumns(nextColumns!)
    queryClient.setQueryData(queryKey, nextColumns)

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks/drag`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: result.draggableId,
        sourceColumnId: result.source.droppableId,
        targetColumnId: result.destination.droppableId,
        oldPosition: sourceIndex + 1,
        newPosition: destinationIndex + 1
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to drag task')
      })
      .catch(() => {
        setColumns(previousColumns!)
        queryClient.setQueryData(queryKey, previousColumns)
      })
  }

  if (!activeBoard) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
        <Image
          src="/Illustrations/noActiveBoard_light.png"
          alt="No board selected"
          width={300}
          height={200}
          className="dark:hidden object-contain w-75 h-50"
          loading="eager"
        />
        <Image
          src="/Illustrations/noActiveBoard_dark.png"
          alt="No board selected"
          width={300}
          height={200}
          className="hidden dark:block object-contain w-75 h-50"
          loading="eager"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[24px] font-bold text-foreground">No board selected</h2>
        </div>
      </div>
    )
  }

  if (isLoading || (isFetching && columns?.length === 0)) {
    return Array.from({ length: 3 }).map((_, i) => <ColumnSkeleton key={i} taskCount={3} />)
  }

  return (
    <>
      <TaskDialogModal />
      <DragDropContext onDragEnd={onDragEnd}>
        {columns?.map((column: Columndb) => (
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
