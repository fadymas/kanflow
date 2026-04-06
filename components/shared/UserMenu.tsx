'use client'

import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/sign-in">
        <Button variant="ghost" className="text-[14px] font-medium">
          Sign In
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button className="bg-[#635fc7] hover:bg-[#4a46ad] text-white rounded-full px-6">
          Sign Up
        </Button>
      </Link>
    </div>
  )
}

export function AuthUserButton() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: 'w-10 h-10'
        }
      }}
    />
  )
}
