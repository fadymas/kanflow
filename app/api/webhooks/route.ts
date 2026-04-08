import { createUser } from '@/lib/actions/user.action'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const { id } = evt.data
    const eventType = evt.type

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

    if (eventType === 'user.created') {
      const primaryEmail = evt.data.email_addresses[0].email_address

      const name =
        [evt.data.first_name, evt.data.last_name].filter(Boolean).join(' ').trim() ||
        evt.data.username ||
        null

      const imageUrl = evt.data.image_url || null

      await createUser({
        clerkId: evt.data.id,
        email: primaryEmail,
        name,
        imageUrl
      })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
