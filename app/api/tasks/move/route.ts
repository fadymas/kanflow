import { prisma } from '@/lib/prisma'
import { getCurrentDbUser, sanitize } from '@/lib/server/api'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/tasks/move  body: { taskId, columnId }
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const body = await req.json()

    if (!body.taskId) return NextResponse.json({ error: 'taskId is required' }, { status: 400 })

    if (!body.columnId) return NextResponse.json({ error: 'columnId is required' }, { status: 400 })

    // Verify task ownership
    const task = await prisma.task.findFirst({
      where: { id: BigInt(body.taskId) },
      include: { Column: { include: { Board: true } } }
    })
    if (!task || task.Column?.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    // Verify target column belongs to the same board and owner
    const targetColumn = await prisma.column.findFirst({
      where: { id: BigInt(body.columnId) },
      include: { Board: true }
    })
    if (!targetColumn || targetColumn.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })

    const sourceColumnId = task.columnId
    const sourcePosition = Number(task.position)
    const targetColumnId = BigInt(body.columnId)

    // Place at the end of the target column
    const lastTask = await prisma.task.findFirst({
      where: { columnId: targetColumnId },
      orderBy: { position: 'desc' }
    })
    const nextPosition = lastTask?.position ? Number(lastTask.position) + 1 : 1

    const [updated] = await prisma.$transaction([
      // Move the task to the target column at the last position
      prisma.task.update({
        where: { id: BigInt(body.taskId) },
        data: { columnId: targetColumnId, updated_at: new Date(), position: nextPosition },
        include: { SubTask: true }
      }),
      // Decrement positions of tasks that were after the moved task in the source column
      prisma.task.updateMany({
        where: {
          columnId: sourceColumnId,
          position: { gt: sourcePosition },
          id: { not: BigInt(body.taskId) }
        },
        data: { position: { decrement: 1 } }
      })
    ])

    return NextResponse.json({ task: sanitize(updated) }, { status: 200 })
  } catch (error) {
    console.error('Failed to move task:', error)
    return NextResponse.json({ error: 'Failed to move task' }, { status: 500 })
  }
}
