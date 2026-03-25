import { Plus_Jakarta_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import Header from './Header'
import CustomSidebar from './CustomSidebar'
import { SidebarProvider } from '../ui/sidebar'
import { ThemeProvider } from 'theme-handler'
const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})
export default async function ThemeLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value
  const sidebar_state = cookieStore.get('sidebar_state')?.value
  console.log(sidebar_state)
  return (
    <html suppressHydrationWarning lang="en" className={`${plusJakarta.variable} `}>
      <body className="min-h-screen k-background">
        <ThemeProvider theme={theme ?? 'system'}>
          <Header />
          <SidebarProvider defaultOpen={sidebar_state === 'true'}>
            <CustomSidebar />
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
