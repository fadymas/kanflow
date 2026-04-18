import { UserJSON } from '@clerk/nextjs/server'

export function extractEmail(data: UserJSON): string | null {
  return (
    data.email_addresses?.find((e) => e.id === data.primary_email_address_id)?.email_address ??
    data.email_addresses?.[0]?.email_address ??
    null
  )
}

export function extractName(data: UserJSON): string | null {
  return [data.first_name, data.last_name].filter(Boolean).join(' ').trim() || data.username || null
}

export function extractImageUrl(data: { image_url: string }): string | null {
  return data.image_url || null
}
