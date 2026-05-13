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

    // Verify task ownership and that it actually lives in the stated source column
    const task = await prisma.task.findFirst({
      where: { id: taskId },
      include: { Column: { include: { Board: true } } }
    })
    if (!task || task.Column?.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    if (task.columnId !== sourceColumnId)
      return NextResponse.json(
        { error: "sourceColumnId does not match task's current column" },
        { status: 400 }
      )

    // Fetch both columns and verify they belong to the same board owned by the user
    const [sourceColumn, targetColumn] = await Promise.all([
      prisma.column.findFirst({ where: { id: sourceColumnId }, include: { Board: true } }),
      prisma.column.findFirst({ where: { id: targetColumnId }, include: { Board: true } })
    ])

    if (!sourceColumn || sourceColumn.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Source column not found' }, { status: 404 })

    if (!targetColumn || targetColumn.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Target column not found' }, { status: 404 })

    if (sourceColumn.boardId !== targetColumn.boardId)
      return NextResponse.json({ error: 'Columns must belong to the same board' }, { status: 400 })

    const isSameColumn = sourceColumnId === targetColumnId

    let updated

    if (isSameColumn) {
      // ── Same-column reorder ──────────────────────────────────────────────
      // Moving DOWN (e.g. position 2 → 5): tasks between old+1 and new shift up (decrement)
      // Moving UP   (e.g. position 5 → 2): tasks between new and old-1 shift down (increment)
      const movingDown = newPosition > oldPosition

      ;[updated] = await prisma.$transaction([
        prisma.task.update({
          where: { id: taskId },
          data: { position: newPosition, updated_at: new Date() },
          include: { SubTask: true }
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
      // ── Cross-column move ────────────────────────────────────────────────
      // Source: tasks after oldPosition shift up (decrement)
      // Target: tasks at or after newPosition shift down (increment) to make room
      ;[updated] = await prisma.$transaction([
        prisma.task.update({
          where: { id: taskId },
          data: { columnId: targetColumnId, position: newPosition, updated_at: new Date() },
          include: { SubTask: true }
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
