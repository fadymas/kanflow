import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'
import { ui } from '@clerk/ui'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { cookies } from 'next/headers'

import { ThemeProvider } from 'theme-handler'

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_URL
    ? new URL(process.env.NEXT_PUBLIC_URL)
    : new URL('https://kanflow-two.vercel.app'),

  openGraph: {
    title: 'KanFlow — Simplified Task Management',
    description:
      'A real-time Kanban board featuring drag-and-drop tasks, board organization, and secure authentication.',
    url: 'https://kanflow-two.vercel.app',
    siteName: 'KanFlow',

    locale: 'en_US',
    type: 'website'
  },

  twitter: {
    card: 'summary_large_image',
    title: 'KanFlow — Simplified Task Management',
    description:
      'A real-time Kanban board featuring drag-and-drop tasks, board organization, and secure authentication.'
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
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
