import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/users  body: { clerkId, email?, name?, imageUrl? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const clerkId = body.clerkId?.trim()
    if (!clerkId) return NextResponse.json({ error: 'clerkId is required' }, { status: 400 })
    const email = body.email?.trim().toLowerCase() || null
    const name = body.name?.trim() || null
    const imageUrl = body.imageUrl?.trim() || null

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ clerkId }, ...(email ? [{ email }] : [])] }
    })

    if (existingUser && existingUser.clerkId === clerkId && existingUser.email === email) {
      return NextResponse.json({ user: existingUser }, { status: 200 })
    }

    const user = await prisma.user.create({ data: { clerkId, email, name, imageUrl } })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

// PATCH /api/users  body: { clerkId, email?, name?, imageUrl? }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const clerkId = body.clerkId?.trim()
    if (!clerkId) return NextResponse.json({ error: 'clerkId is required' }, { status: 400 })

    const email = body.email?.trim().toLowerCase() || null
    const name = body.name?.trim() || null
    const imageUrl = body.imageUrl?.trim() || null

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ clerkId }, ...(email ? [{ email }] : [])] }
    })

    if (!existingUser) {
      const user = await prisma.user.create({ data: { clerkId, email, name, imageUrl } })
      return NextResponse.json({ user }, { status: 201 })
    }

    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: { clerkId, email, name, imageUrl }
    })
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/users  body: { clerkId }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const clerkId = body.clerkId?.trim()
    if (!clerkId) return NextResponse.json({ error: 'clerkId is required' }, { status: 400 })

    await prisma.user.deleteMany({ where: { clerkId } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
