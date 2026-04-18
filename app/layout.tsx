import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'
import { ui } from '@clerk/ui'
import { Plus_Jakarta_Sans } from 'next/font/google'
import ThemeLayout from '@/components/layout/ThemeLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kanban Task Management',
  description:
    'A beautiful, responsive Kanban board for managing tasks across multiple projects with full dark mode support.'
}
const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen k-background">
        <Suspense fallback={<div>Loading...</div>}>
          <ClerkProvider appearance={shadcn} ui={ui}>
            <ThemeLayout>{children}</ThemeLayout>
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  )
}
