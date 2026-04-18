import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function getCurrentDbUser() {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as NextResponse,
      user: null
    }
  }

  const user = await prisma.user.findFirst({
    where: { clerkId: userId }
  })

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Application user not found for this Clerk account' },
        { status: 404 }
      ) as NextResponse,
      user: null
    }
  }

  return { error: null, user }
}
