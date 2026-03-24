import { ThemeProvider } from 'next-themes'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import Header from './Header'
import CustomSidebar from './CustomSidebar'

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})
export default async function ThemeLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value

  return (
    <html suppressHydrationWarning lang="en" className={`${plusJakarta.variable} ${theme}`}>
      <body className="min-h-screen k-background">
        <ThemeProvider attribute="class" enableSystem={true}>
          <Header />
          <CustomSidebar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
