'use client'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import Column from './Column'
import TaskDialogModal from '../dialogs/TaskDialogModal'
import { useBoardStore } from '@/providers/board-store-provider'
import { Columndb } from '@/mocks/column.mock'

function Board() {
  const activeBoard = useBoardStore((s) => s.activeBoardID) || -1
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
    enabled: !!activeBoard && activeBoard !== -1
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

    const sourceIndex = result.source.index // 0-based
    const destinationIndex = result.destination.index // 0-based

    // ── Snapshot for rollback ────────────────────────────────────────────
    const previousColumns = columns

    // ── Compute next state ───────────────────────────────────────────────
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

    // ── Instant local update ─────────────────────────────────────────────
    setColumns(nextColumns!)

    // ── API call ─────────────────────────────────────────────────────────
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
        // Sync local state into React Query cache so other consumers stay consistent
        queryClient.setQueryData(queryKey, nextColumns)
      })
      .catch(() => {
        // Rollback on failure
        setColumns(previousColumns!)
      })
  }

  if (activeBoard === -1) {
    return <div>No active board selected</div>
  }

  if (isLoading || (isFetching && columns?.length === 0)) {
    return <div>Loading...</div>
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
