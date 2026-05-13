'use client'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Column from './Column'
import TaskDialogModal from '../dialogs/TaskDialogModal'
import { useBoardStore } from '@/providers/board-store-provider'
import { Columndb } from '@/mocks/column.mock'

function Board() {
  const activeBoard = useBoardStore((s) => s.activeBoard)
  const setColumns = useBoardStore((s) => s.setColumns)
  const storedColumns = useBoardStore((s) => s.columns)
  const queryClient = useQueryClient()

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

    // ── Snapshot for rollback ────────────────────────────────────────────
    const previousColumns = storedColumns

    // ── Compute next state ───────────────────────────────────────────────
    const nextColumns = storedColumns.map((col) => {
      if (isSameColumn) {
        if (col.id == result.source.droppableId) {
          const newTasks = Array.from(col.Task)
          const [movedTask] = newTasks.splice(result.source.index - 1, 1)
          newTasks.splice(result.destination!.index - 1, 0, movedTask)
          return { ...col, Task: newTasks.map((t, i) => ({ ...t, position: i + 1 })) }
        }
      } else {
        if (col.id == result.source.droppableId) {
          const newTasks = Array.from(col.Task)
          newTasks.splice(result.source.index - 1, 1)
          return { ...col, Task: newTasks.map((t, i) => ({ ...t, position: i + 1 })) }
        }
        if (col.id == result.destination?.droppableId) {
          const sourceCol = storedColumns.find((c) => c.id == result.source.droppableId)
          const movedTask = sourceCol?.Task[result.source.index - 1]
          if (!movedTask) return col
          const newTasks = Array.from(col.Task)
          newTasks.splice(result.destination!.index - 1, 0, { ...movedTask })
          return { ...col, Task: newTasks.map((t, i) => ({ ...t, position: i + 1 })) }
        }
      }
      return col
    })

    // ── Optimistic update: synchronous, no render cycle delay ────────────
    setColumns(nextColumns as Columndb[])
    queryClient.setQueryData(['columns', activeBoard?.id], nextColumns)

    // ── API call ─────────────────────────────────────────────────────────
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks/drag`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: result.draggableId,
        sourceColumnId: result.source.droppableId,
        targetColumnId: result.destination.droppableId,
        oldPosition: result.source.index,
        newPosition: result.destination.index
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to drag task')
      })
      .catch(() => {
        // ── Rollback ─────────────────────────────────────────────────────
        setColumns(previousColumns)
        queryClient.setQueryData(['columns', activeBoard?.id], previousColumns)
      })
  }

  if (status === 'pending' || isLoading) {
    return <div>Loading....</div>
  }

  if (status === 'success' || !isLoading) {
    if (columns.length === 0) {
      return <div className="text-center mt-20 text-knetural-default">No columns found.</div>
    }
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
