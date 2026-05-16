import { extractEmail, extractName, extractImageUrl } from '@/app/api/webhooks/clerk/helpers'
import { UserJSON } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

type UserDeletedJson = { id?: string }

export async function handleUserCreated(data: UserJSON) {
  const clerkId = data.id
  const email = extractEmail(data)
  const name = extractName(data)
  const imageUrl = extractImageUrl(data)

  const existing = await prisma.user.findFirst({
    where: { OR: [{ clerkId }, ...(email ? [{ email }] : [])] }
  })

  if (existing && existing.clerkId === clerkId && existing.email === email) return

  await prisma.user.create({ data: { clerkId, email, name, imageUrl } })
}

export async function handleUserUpdated(data: UserJSON) {
  const clerkId = data.id
  const email = extractEmail(data)
  const name = extractName(data)
  const imageUrl = extractImageUrl(data)

  const existing = await prisma.user.findFirst({
    where: { OR: [{ clerkId }, ...(email ? [{ email }] : [])] }
  })

  if (!existing) {
    await prisma.user.create({ data: { clerkId, email, name, imageUrl } })
    return
  }

  await prisma.user.update({
    where: { id: existing.id },
    data: { clerkId, email, name, imageUrl }
  })
}

export async function handleUserDeleted(data: UserDeletedJson) {
  if (!data.id) return
  await prisma.user.delete({ where: { clerkId: data.id } })
}
