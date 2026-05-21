/* eslint-disable @typescript-eslint/no-explicit-any */
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── Origins ────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'https://kanflow-two.vercel.app',
  process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
]

// ── Route matchers ─────────────────────────────────────────────────────────
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/marketing(.*)',
  '/api/webhooks(.*)'
])

const isApiRoute = createRouteMatcher(['/api/(.*)'])

// ── Rate limiter ───────────────────────────────────────────────────────────
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(60, '1 m'),
        analytics: true,
        prefix: 'kanflow'
      })
    : null

// ── Build CORS headers ─────────────────────────────────────────────────────
function getCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') ?? ''
  const isAllowed = allowedOrigins.includes(origin)

  if (!isAllowed) return {}

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  }
}

// ── Base Clerk Handler ─────────────────────────────────────────────────────
// We wrap the clerkMiddleware execution into a separate block
const clerkHandler = clerkMiddleware(async (auth, req) => {
  const corsHeaders = getCorsHeaders(req)

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders })
  }

  // Rate limit API routes only
  if (isApiRoute(req) && ratelimit) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      '127.0.0.1'

    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          ...corsHeaders
        }
      })
    }

    if (!isPublicRoute(req)) await auth.protect()

    return NextResponse.next({
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        ...corsHeaders
      }
    })
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  return NextResponse.next({ headers: corsHeaders })
})

// ── Root Middleware Interceptor ────────────────────────────────────────────
// This serves as the master gatekeeper to drop Google Search Console issues entirely
export default async function proxy(req: NextRequest, event: any) {
  const userAgent = req.headers.get('user-agent') || ''
  const pathname = req.nextUrl.pathname

  // Match Google/Bing bots or common crawler signatures
  const isBot = /bot|crawler|spider|google|bing|yahoo|search-console/i.test(userAgent)

  // Match crucial SEO static files
  const isSeoFile =
    pathname === '/sitemap.xml' || pathname === '/robots.txt' || pathname.startsWith('/public/')

  // If it's a search bot or a direct asset fetch, yield control immediately
  if (isBot || isSeoFile) {
    const corsHeaders = getCorsHeaders(req)
    return NextResponse.next({ headers: corsHeaders })
  }

  // Otherwise, fallback to your normal Clerk authentication pipeline
  return clerkHandler(req, event)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    '/(api|trpc)(.*)'
  ]
}
