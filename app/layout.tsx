import type { Metadata } from 'next'
import { Suspense } from 'react'
import ThemeLayout from '@/components/shared/ThemeLayout'
import './globals.css'
export const metadata: Metadata = {
  title: 'Kanban Task Management',
  description:
    'A beautiful, responsive Kanban board for managing tasks across multiple projects with full dark mode support.'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeLayout>{children}</ThemeLayout>
    </Suspense>
  )
}
