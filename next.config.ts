import type { NextConfig } from 'next'

const allowedOrigins = [
  'https://kanflow-two.vercel.app',
  'https://kanflow-rzqldhrxd-fadymas-projects.vercel.app',
  process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
].filter(Boolean)

const isDev = process.env.NODE_ENV === 'development'
const isVercel = !!process.env.VERCEL

const csp = [
  "default-src 'self'",

  // Scripts
  [
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    'https://clerk.com',
    'https://*.clerk.com',
    'https://*.clerk.accounts.dev',
    'https://challenges.cloudflare.com/turnstile/v0/api.js',
    // Vercel toolbar (preview deployments) + Speed Insights + Analytics
    isVercel
      ? 'https://vercel.live https://*.vercel.live https://vercel.com https://va.vercel-scripts.com'
      : '',
    isDev ? 'http://localhost:3000 https://va.vercel-scripts.com' : ''
  ]
    .filter(Boolean)
    .join(' '),

  // Styles
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  // Fonts
  "font-src 'self' https://fonts.gstatic.com data:",

  // Images
  "img-src 'self' blob: data: https://img.clerk.com https://*.clerk.com https://vercel.com",

  // Fetch / WebSocket connections
  [
    "connect-src 'self'",
    'https://*.clerk.com',
    'https://*.clerk.accounts.dev',
    'https://clerk.com',
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://prisma-data.net',
    'https://*.prisma-data.net',
    'https://clerk-telemetry.com/v1/event',
    // Vercel Analytics + Speed Insights reporting endpoints
    isVercel
      ? 'https://vercel.live https://*.vercel.live wss://vercel.live https://va.vercel-scripts.com https://*.vercel.app'
      : '',
    isDev ? 'http://localhost:3000 ws://localhost:3000 https://va.vercel-scripts.com' : ''
  ]
    .filter(Boolean)
    .join(' '),

  // Frames
  [
    "frame-src 'self'",
    'https://clerk.com',
    'https://*.clerk.com',
    'https://*.clerk.accounts.dev',
    'https://challenges.cloudflare.com/',
    isVercel ? 'https://vercel.live https://*.vercel.live' : ''
  ]
    .filter(Boolean)
    .join(' '),

  // Workers
  "worker-src 'self' blob:",

  // Manifests
  "manifest-src 'self'",

  // Block plugins
  "object-src 'none'",

  // Block <base> tag hijacking
  "base-uri 'self'",

  // Block form submissions to external domains
  "form-action 'self'",

  // Prevent clickjacking
  "frame-ancestors 'self'"
]
  .filter(Boolean)
  .join('; ')

const nextConfig: NextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000'],

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins.join(', ')
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PATCH, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400'
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
        as: '*.js'
      }
    }
  }
}

export default nextConfig
