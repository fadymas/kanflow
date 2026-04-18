import { prisma } from '@/lib/prisma'
import { getCurrentDbUser } from '@/lib/server/api'
import { getRandomHexColor } from '@/lib/utils'
import { createBoardSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { user, error } = await getCurrentDbUser()

    if (error) {
      return error
    }

    const boards = await prisma.board.findMany({
      where: { ownerId: user.id },
      select: { id: true, name: true },
      orderBy: { created_at: 'asc' }
    })

    const safeBoards = JSON.parse(
      JSON.stringify(boards, (_, value) => (typeof value === 'bigint' ? Number(value) : value))
    )
    return NextResponse.json({ boards: safeBoards }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch boards:', error)
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentDbUser()
    if (!user) {
      throw new Error('user not found')
    }
    const body = await req.json()
    const parsedBody = createBoardSchema.safeParse(body)

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Invalid board data',
          issues: parsedBody.error.flatten()
        },
        { status: 400 }
      )
    }

    const board = await prisma.board.create({
      data: {
        name: parsedBody.data.name,
        ownerId: user.id,
        Column: {
          create: parsedBody.data.columns.map((column, index) => ({
            name: column.name,
            position: Number(index + 1),
            color: getRandomHexColor()
          }))
        }
      },
      include: {
        Column: {
          orderBy: { position: 'asc' }
        }
      }
    })

    const safeBoard = JSON.parse(
      JSON.stringify(board, (_, value) => (typeof value === 'bigint' ? Number(value) : value))
    )

    return NextResponse.json({ board: safeBoard }, { status: 201 })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    console.error('Failed to create board:', error)
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 })
  }
}
