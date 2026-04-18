'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../prisma'
import { getCurrentDbUser } from '../server/api'
import { getRandomHexColor } from '../utils'
import { createBoardSchema, CreateBoardSchema } from '../validation'

async function createBoard(data: CreateBoardSchema) {
  try {
    const { user } = await getCurrentDbUser()
    if (!user) {
      throw new Error('user not found')
    }

    const parsedBody = createBoardSchema.safeParse(data)

    if (!parsedBody.success) {
      console.log('not validate')
    }

    await prisma.board.create({
      data: {
        name: parsedBody.data!.name,
        ownerId: user.id,
        Column: {
          create: parsedBody.data!.columns.map((column, index) => ({
            name: column.name,
            position: Number(index + 1),
            color: getRandomHexColor()
          }))
        }
      }
    })

    revalidatePath('/')
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log(error)
    }
  }
}

export { createBoard }
