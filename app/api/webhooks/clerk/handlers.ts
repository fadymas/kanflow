import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action'
import { extractEmail, extractName, extractImageUrl } from '@/app/api/webhooks/clerk/helpers'
import { UserJSON } from '@clerk/nextjs/server'

export async function handleUserCreated(data: UserJSON) {
  await createUser({
    clerkId: data.id,
    email: extractEmail(data),
    name: extractName(data),
    imageUrl: extractImageUrl(data)
  })
}

export async function handleUserUpdated(data: UserJSON) {
  await updateUser({
    clerkId: data.id,
    email: extractEmail(data),
    name: extractName(data),
    imageUrl: extractImageUrl(data)
  })
}

export async function handleUserDeleted(data: UserDeletedJson) {
  if (!data.id) return
  await deleteUser({ clerkId: data.id })
}
