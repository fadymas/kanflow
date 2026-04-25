import { prisma } from '@/lib/prisma'
import { getCurrentDbUser, sanitize } from '@/lib/server/api'
import { createTaskSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/tasks?columnId=123
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const columnId = req.nextUrl.searchParams.get('columnId')
    if (!columnId) return NextResponse.json({ error: 'columnId is required' }, { status: 400 })

    // Verify ownership via board
    const column = await prisma.column.findFirst({
      where: { id: BigInt(columnId) },
      include: { Board: true }
    })
    if (!column || column.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })

    const tasks = await prisma.task.findMany({
      where: { columnId: BigInt(columnId) },
      orderBy: { position: 'asc' },
      include: { SubTask: true }
    })

    return NextResponse.json({ tasks: sanitize(tasks) }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST /api/tasks  body: { columnId, title, description?, subtasks: [{ title }] }
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const body = await req.json()

    // Resolve column by name or id
    if (!body.column) return NextResponse.json({ error: 'column required' }, { status: 400 })

    const parsed = createTaskSchema.safeParse({
      title: body.title,
      description: body.description ?? '',
      subtasks: body.subtasks ?? [],
      column: body.column
    })
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Invalid data', issues: parsed.error.flatten() },
        { status: 400 }
      )

    // Find column — support lookup by id or by name within a board
    const column = await prisma.column.findFirst({
      where: { id: BigInt(body.column) },
      include: { Board: true }
    })

    if (!column || column.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })

    // Place at the end of the column
    const lastTask = await prisma.task.findFirst({
      where: { columnId: column.id },
      orderBy: { position: 'desc' }
    })
    const nextPosition = lastTask?.position ? Number(lastTask.position) + 1 : 1

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        columnId: column.id,
        position: nextPosition,
        SubTask: {
          create: parsed.data.subtasks.map((s) => ({ title: s.title, isCompleted: false }))
        }
      },
      include: { SubTask: true }
    })

    return NextResponse.json({ task: sanitize(task) }, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

// PATCH /api/tasks  body: { taskId, title?, description?, columnId?, position?, subtasks? }
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const body = await req.json()
    if (!body.taskId) return NextResponse.json({ error: 'taskId is required' }, { status: 400 })

    const task = await prisma.task.findFirst({
      where: { id: BigInt(body.taskId) },
      include: { Column: { include: { Board: true } } }
    })
    if (!task || task.Column?.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const updated = await prisma.task.update({
      where: { id: BigInt(body.taskId) },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.columnId !== undefined && { columnId: BigInt(body.columnId) }),
        ...(body.position !== undefined && { position: body.position }),
        updated_at: new Date()
      },
      include: { SubTask: true }
    })

    // Optionally update subtask completion states
    if (Array.isArray(body.subtasks)) {
      await Promise.all(
        body.subtasks.map((s: { id: number; isCompleted: boolean }) =>
          prisma.subTask.update({
            where: { id: BigInt(s.id) },
            data: { isCompleted: s.isCompleted }
          })
        )
      )
    }

    return NextResponse.json({ task: sanitize(updated) }, { status: 200 })
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks?taskId=123
export async function DELETE(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const taskId = req.nextUrl.searchParams.get('taskId')
    if (!taskId) return NextResponse.json({ error: 'taskId is required' }, { status: 400 })

    const task = await prisma.task.findFirst({
      where: { id: BigInt(taskId) },
      include: { Column: { include: { Board: true } } }
    })
    if (!task || task.Column?.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const deletedPosition = Number(task.position ?? 0)
    const columnId = task.columnId!

    // Use a transaction so the delete + reorder are atomic
    await prisma.$transaction([
      // Delete the task (SubTasks cascade via schema)
      prisma.task.delete({ where: { id: BigInt(taskId) } }),

      // Shift every task that sat below the deleted one up by 1
      // so positions stay compact with no gaps (e.g. 1,2,4 → 1,2,3)
      prisma.task.updateMany({
        where: {
          columnId,
          position: { gt: deletedPosition }
        },
        data: {
          position: { decrement: 1 }
        }
      })
    ])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Failed to delete task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
