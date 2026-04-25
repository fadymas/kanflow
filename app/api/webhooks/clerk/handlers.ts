import { extractEmail, extractName, extractImageUrl } from '@/app/api/webhooks/clerk/helpers'
import { UserJSON } from '@clerk/nextjs/server'

const BASE_URL = process.env.NEXT_PUBLIC_URL

export async function handleUserCreated(data: UserJSON) {
  await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clerkId: data.id,
      email: extractEmail(data),
      name: extractName(data),
      imageUrl: extractImageUrl(data)
    })
  })
}

export async function handleUserUpdated(data: UserJSON) {
  await fetch(`${BASE_URL}/api/users`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clerkId: data.id,
      email: extractEmail(data),
      name: extractName(data),
      imageUrl: extractImageUrl(data)
    })
  })
}

export async function handleUserDeleted(data: UserDeletedJson) {
  if (!data.id) return
  await fetch(`${BASE_URL}/api/users`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clerkId: data.id })
  })
}
