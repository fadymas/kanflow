import { prisma } from '@/lib/prisma'
import { getCurrentDbUser, sanitize } from '@/lib/server/api'
import { getRandomHexColor } from '@/lib/utils'
import { createColumnSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/columns?boardId=123
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const boardId = req.nextUrl.searchParams.get('boardId')
    if (!boardId) return NextResponse.json({ error: 'boardId is required' }, { status: 400 })

    const board = await prisma.board.findFirst({
      where: { id: BigInt(boardId), ownerId: user.id }
    })
    if (!board) return NextResponse.json({ error: 'Board not found' }, { status: 404 })

    const columns = await prisma.column.findMany({
      where: { boardId: BigInt(boardId) },
      select: {
        id: true,
        name: true,
        color: true,
        position: true,
        Task: { orderBy: { position: 'asc' }, include: { SubTask: true } }
      },
      orderBy: { position: 'asc' }
    })

    const safeColumns = JSON.parse(
      JSON.stringify(columns, (_, value) => (typeof value === 'bigint' ? Number(value) : value))
    )

    return NextResponse.json({ columns: safeColumns }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch columns:', error)
    return NextResponse.json({ error: 'Failed to fetch columns' }, { status: 500 })
  }
}

// POST /api/columns  body: { boardId, title, color? }
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const body = await req.json()
    const parsed = createColumnSchema.safeParse({
      title: body.title,
      color: body.color ?? getRandomHexColor()
    })
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Invalid data', issues: parsed.error.flatten() },
        { status: 400 }
      )

    console.log(typeof body.boardId)
    if (!body.boardId) return NextResponse.json({ error: 'boardId is required' }, { status: 400 })

    const board = await prisma.board.findFirst({
      where: { id: BigInt(body.boardId), ownerId: user.id }
    })
    if (!board) return NextResponse.json({ error: 'Board not found' }, { status: 404 })

    const lastColumn = await prisma.column.findFirst({
      where: { boardId: BigInt(body.boardId) },
      orderBy: { position: 'desc' }
    })
    const nextPosition = lastColumn?.position ? Number(lastColumn.position) + 1 : 1

    const column = await prisma.column.create({
      data: {
        name: parsed.data.title,
        color: parsed.data.color,
        position: nextPosition,
        boardId: BigInt(body.boardId)
      }
    })

    return NextResponse.json({ column: sanitize(column) }, { status: 201 })
  } catch (error) {
    console.error('Failed to create column:', error)
    return NextResponse.json({ error: 'Failed to create column' }, { status: 500 })
  }
}

// PATCH /api/columns  body: { columnId, name?, color?, position? }
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const body = await req.json()
    if (!body.columnId) return NextResponse.json({ error: 'columnId is required' }, { status: 400 })

    const column = await prisma.column.findFirst({
      where: { id: BigInt(body.columnId) },
      include: { Board: true }
    })
    if (!column || column.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })

    const updated = await prisma.column.update({
      where: { id: BigInt(body.columnId) },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.position !== undefined && { position: body.position }),
        updated_at: new Date()
      }
    })

    return NextResponse.json({ column: sanitize(updated) }, { status: 200 })
  } catch (error) {
    console.error('Failed to update column:', error)
    return NextResponse.json({ error: 'Failed to update column' }, { status: 500 })
  }
}

// DELETE /api/columns?columnId=123
export async function DELETE(req: NextRequest) {
  try {
    const { user, error } = await getCurrentDbUser()
    if (error) return error

    const columnId = req.nextUrl.searchParams.get('columnId')
    if (!columnId) return NextResponse.json({ error: 'columnId is required' }, { status: 400 })

    const column = await prisma.column.findFirst({
      where: { id: BigInt(columnId) },
      include: { Board: true }
    })
    if (!column || column.Board?.ownerId !== user.id)
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })

    await prisma.column.delete({ where: { id: BigInt(columnId) } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Failed to delete column:', error)
    return NextResponse.json({ error: 'Failed to delete column' }, { status: 500 })
  }
}
