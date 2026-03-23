import type { Metadata } from 'next'
import './globals.css'
import { Suspense } from 'react'
import ThemeLayout from '@/components/ThemeLayout'

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
