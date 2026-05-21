import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── Origins ────────────────────────────────────────────────────────────────
const allowedOrigins = ['localhost:3000', process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000']

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
// Only initialise when env vars are present (skips local dev without Upstash)
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 req / min per IP
        analytics: true,
        prefix: 'kanflow'
      })
    : null

// ── CORS helper ────────────────────────────────────────────────────────────
function handleCors(req: NextRequest, res: NextResponse): NextResponse {
  const origin = req.headers.get('origin') ?? ''
  const isAllowed = allowedOrigins.includes(origin)

  if (isAllowed) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Access-Control-Allow-Credentials', 'true')
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  }

  return res
}

// ── Middleware ─────────────────────────────────────────────────────────────
export default clerkMiddleware(async (auth, req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 })
    return handleCors(req, preflight)
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
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString()
        }
      })
    }

    // Attach rate limit headers to passing requests too
    const res = NextResponse.next()
    res.headers.set('X-RateLimit-Limit', limit.toString())
    res.headers.set('X-RateLimit-Remaining', remaining.toString())
    res.headers.set('X-RateLimit-Reset', reset.toString())

    if (!isPublicRoute(req)) await auth.protect()
    return handleCors(req, res)
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  const res = NextResponse.next()
  return handleCors(req, res)
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
