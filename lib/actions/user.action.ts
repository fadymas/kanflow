'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type CreateUserInput = {
  clerkId: string
  email?: string | null
  name?: string | null
  imageUrl?: string | null
}

export async function createUser(data: CreateUserInput) {
  const clerkId = data.clerkId.trim()
  const email = data.email?.trim().toLowerCase() || null
  const name = data.name?.trim() || null
  const imageUrl = data.imageUrl?.trim() || null

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ clerkId }, ...(email ? [{ email }] : [])]
    }
  })

  if (existingUser) {
    if (existingUser.clerkId === clerkId && existingUser.email === email) {
      return existingUser
    }
  }

  await prisma.user.create({
    data: {
      clerkId,
      email,
      name,
      imageUrl
    }
  })

  revalidatePath('/')
}
