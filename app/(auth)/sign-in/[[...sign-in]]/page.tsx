import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your KanFlow account to manage your boards and tasks.',
  openGraph: {
    title: 'Sign In | KanFlow',
    description: 'Sign in to your KanFlow account to manage your boards and tasks.'
  },
  robots: {
    index: false,
    follow: false
  }
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn />
    </div>
  )
}
