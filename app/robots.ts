import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/board', '/sign-in', '/sign-up', '/user-profile', '/api/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
