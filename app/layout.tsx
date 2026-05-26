import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'
import { ui } from '@clerk/ui'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

import { cookies } from 'next/headers'

import { ThemeProvider } from 'theme-handler'
import { Toaster } from '@/components/ui/sonner'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_URL
    ? new URL(process.env.NEXT_PUBLIC_URL)
    : new URL('https://kanflow-two.vercel.app'),
  verification: {
    google: 'gDo-bQE_5gQoEWlpOsKdHaMRERDv7C4pK3XwHPKC3dk'
  },
  title: {
    default: 'KanFlow — Simplified Task Management',
    template: '%s | KanFlow'
  },
  description:
    'KanFlow is a real-time Kanban board for managing tasks across multiple projects. Drag-and-drop tasks, organize boards, collaborate with your team, and stay productive.',
  keywords: [
    'kanban',
    'task management',
    'project management',
    'productivity',
    'team collaboration',
    'kanflow'
  ],
  authors: [{ name: 'Fady Mahrous' }],
  creator: 'Fady Mahrous',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'KanFlow',
    title: 'KanFlow — Simplified Task Management',
    description:
      'A real-time Kanban board featuring drag-and-drop tasks, board organization, and secure authentication. Built for high-performance teams.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KanFlow — Simplified Task Management',
    description:
      'A real-time Kanban board featuring drag-and-drop tasks, board organization, and secure authentication.'
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico'
  }
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
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value

  return (
    <html
      lang="en"
      className={`${plusJakarta.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen k-background">
        <ClerkProvider appearance={shadcn} ui={ui}>
          <ThemeProvider theme={theme ?? 'light'}>
            {children}
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </ClerkProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
