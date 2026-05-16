import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'
import { ui } from '@clerk/ui'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

import { cookies } from 'next/headers'

import { ThemeProvider } from 'theme-handler'

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
          <ThemeProvider theme={theme ?? 'light'}>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
