import { prisma } from '@/lib/prisma'
import { getCurrentDbUser, sanitize } from '@/lib/server/api'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/tasks/drag
// body: { taskId, sourceColumnId, targetColumnId, oldPosition, newPosition }
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const body = await req.json()

    if (!body.taskId) return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
    if (!body.sourceColumnId)
      return NextResponse.json({ error: 'sourceColumnId is required' }, { status: 400 })
    if (!body.targetColumnId)
      return NextResponse.json({ error: 'targetColumnId is required' }, { status: 400 })
    if (body.oldPosition == null)
      return NextResponse.json({ error: 'oldPosition is required' }, { status: 400 })
    if (body.newPosition == null)
      return NextResponse.json({ error: 'newPosition is required' }, { status: 400 })

    const taskId = BigInt(body.taskId)
    const sourceColumnId = BigInt(body.sourceColumnId)
    const targetColumnId = BigInt(body.targetColumnId)
    const oldPosition = Number(body.oldPosition)
    const newPosition = Number(body.newPosition) || 1

    const isSameColumn = sourceColumnId === targetColumnId

    // Single query: verify ownership, source column, and (if cross-column) target column same board
    const [task, targetColumn] = await Promise.all([
      prisma.task.findUnique({
        where: { id: taskId },
        select: {
          id: true,
          columnId: true,
          Column: {
            select: {
              boardId: true,
              Board: { select: { ownerId: true } }
            }
          }
        }
      }),
      isSameColumn
        ? Promise.resolve(null)
        : prisma.column.findUnique({
            where: { id: targetColumnId },
            select: { id: true, boardId: true }
          })
    ])

    if (!task || task.Column?.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    if (!isSameColumn) {
      if (!targetColumn)
        return NextResponse.json({ error: 'Target column not found' }, { status: 404 })
      if (targetColumn.boardId !== task.Column!.boardId)
        return NextResponse.json({ error: 'Columns must belong to same board' }, { status: 400 })
    }

    let updated

    if (isSameColumn) {
      const movingDown = newPosition > oldPosition

      ;[updated] = await prisma.$transaction([
        prisma.task.update({
          where: { id: taskId },
          data: { position: newPosition, updated_at: new Date() }
        }),
        prisma.task.updateMany({
          where: {
            columnId: sourceColumnId,
            id: { not: taskId },
            position: movingDown
              ? { gt: oldPosition, lte: newPosition }
              : { gte: newPosition, lt: oldPosition }
          },
          data: { position: movingDown ? { decrement: 1 } : { increment: 1 } }
        })
      ])
    } else {
      ;[updated] = await prisma.$transaction([
        prisma.task.update({
          where: { id: taskId },
          data: { columnId: targetColumnId, position: newPosition, updated_at: new Date() }
        }),
        prisma.task.updateMany({
          where: {
            columnId: sourceColumnId,
            id: { not: taskId },
            position: { gt: oldPosition }
          },
          data: { position: { decrement: 1 } }
        }),
        prisma.task.updateMany({
          where: {
            columnId: targetColumnId,
            id: { not: taskId },
            position: { gte: newPosition }
          },
          data: { position: { increment: 1 } }
        })
      ])
    }

    return NextResponse.json({ task: sanitize(updated) }, { status: 200 })
  } catch (error) {
    console.error('Failed to drag task:', error)
    return NextResponse.json({ error: 'Failed to drag task' }, { status: 500 })
  }
}
