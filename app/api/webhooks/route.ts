import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { handleUserCreated, handleUserUpdated, handleUserDeleted } from './clerk/handlers'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const { id } = evt.data
    const eventType = evt.type

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
