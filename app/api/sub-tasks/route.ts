import { prisma } from '@/lib/prisma'
import { getCurrentDbUser } from '@/lib/server/api'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/subTasks  body: { subTaskId, isCompleted }
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const body = await req.json()

    if (body.subTaskId === undefined)
      return NextResponse.json({ error: 'subTaskId is required' }, { status: 400 })

    if (body.isCompleted === undefined)
      return NextResponse.json({ error: 'isCompleted is required' }, { status: 400 })

    // Verify ownership via task → column → board
    const subTask = await prisma.subTask.findFirst({
      where: { id: BigInt(body.subTaskId) },
      include: {
        Task: {
          include: {
            Column: { include: { Board: true } }
          }
        }
      }
    })

    if (!subTask || subTask.Task?.Column?.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })

    const updated = await prisma.subTask.update({
      where: { id: BigInt(body.subTaskId) },
      data: { isCompleted: Boolean(body.isCompleted) }
    })

    return NextResponse.json(
      { subTask: { id: Number(updated.id), isCompleted: updated.isCompleted } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to update subtask:', error)
    return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 })
  }
}
