import { DropResult } from '@hello-pangea/dnd'

export async function dragTask({
  result,
  sourceIndex,
  destinationIndex
}: {
  result: DropResult
  sourceIndex: number
  destinationIndex: number
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tasks/drag`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskId: result.draggableId,
      sourceColumnId: result.source.droppableId,
      targetColumnId: result.destination!.droppableId,
      oldPosition: sourceIndex + 1,
      newPosition: destinationIndex + 1
    })
  })
  if (!res.ok) throw new Error('Failed to drag task')
}
