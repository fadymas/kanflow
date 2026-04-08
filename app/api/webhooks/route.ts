import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const { id } = evt.data
    const eventType = evt.type

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const primaryEmail =
        evt.data.email_addresses.find((email) => email.id === evt.data.primary_email_address_id)
          ?.email_address ??
        evt.data.email_addresses[0]?.email_address ??
        null

      const name =
        [evt.data.first_name, evt.data.last_name].filter(Boolean).join(' ').trim() ||
        evt.data.username ||
        null

      const imageUrl = evt.data.image_url || null

      if (eventType === 'user.created') {
        await createUser({
          clerkId: evt.data.id,
          email: primaryEmail,
          name,
          imageUrl
        })
      } else {
        await updateUser({
          clerkId: evt.data.id,
          email: primaryEmail,
          name,
          imageUrl
        })
      }
    }

    if (eventType === 'user.deleted' && evt.data.id) {
      await deleteUser({
        clerkId: evt.data.id
      })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
