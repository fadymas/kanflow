import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a free KanFlow account and start organizing your tasks with Kanban boards.',
  openGraph: {
    title: 'Sign Up | KanFlow',
    description: 'Create a free KanFlow account and start organizing your tasks with Kanban boards.'
  },
  robots: {
    index: false,
    follow: false
  }
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp />
    </div>
  )
}
