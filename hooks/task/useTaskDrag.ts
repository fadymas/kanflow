import { dragTask } from '@/app/api/boards/dragTask'
import { Columndb } from '@/mocks/column.mock'
import { DropResult } from '@hello-pangea/dnd'
import { useQueryClient } from '@tanstack/react-query'

interface UseTaskDragParams {
  columns: Columndb[] | undefined
  setColumns: (columns: Columndb[]) => void
  queryKey: (string | number | null | undefined)[]
}

export function useTaskDrag({ columns, setColumns, queryKey }: UseTaskDragParams) {
  const queryClient = useQueryClient()

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

    dragTask({ result, sourceIndex, destinationIndex }).catch(() => {
      setColumns(previousColumns!)
      queryClient.setQueryData(queryKey, previousColumns)
    })
  }

  return { onDragEnd }
}
