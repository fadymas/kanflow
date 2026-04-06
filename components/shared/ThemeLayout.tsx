import { cookies } from 'next/headers'

import { ThemeProvider } from 'theme-handler'

export default async function ThemeLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value
  return <ThemeProvider theme={theme ?? 'light'}>{children}</ThemeProvider>
}
