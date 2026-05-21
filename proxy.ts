import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── Origins ────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'https://kanflow-two.vercel.app',
  'https://kanflow-rzqldhrxd-fadymas-projects.vercel.app',
  process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
]

// ── Route matchers ─────────────────────────────────────────────────────────
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/marketing(.*)',
  '/api/webhooks(.*)',
  '/robots.txt',
  '/sitemap.xml'
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

// ── Middleware ─────────────────────────────────────────────────────────────
export default clerkMiddleware(async (auth, req) => {
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

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
