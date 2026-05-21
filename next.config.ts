import type { NextConfig } from 'next'

const allowedOrigins = [
  'https://kanflow-two.vercel.app',
  'https://kanflow-rzqldhrxd-fadymas-projects.vercel.app',
  process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
].filter(Boolean)

const isDev = process.env.NODE_ENV === 'development'

const csp = [
  "default-src 'self'",

  // Scripts — Clerk requires unsafe-inline + unsafe-eval for its UI components
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.com https://*.clerk.accounts.dev ${isDev ? 'http://localhost:3000' : ''}`.trim(),

  // Styles — unsafe-inline needed for Tailwind + Clerk + shadcn injected styles
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  // Fonts
  "font-src 'self' https://fonts.gstatic.com data:",

  // Images — Clerk user avatars come from img.clerk.com
  "img-src 'self' blob: data: https://img.clerk.com https://*.clerk.com",

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
    isDev ? 'http://localhost:3000 ws://localhost:3000' : ''
  ]
    .filter(Boolean)
    .join(' '),

  // Frames — Clerk hosted pages / OAuth popups
  "frame-src 'self' https://clerk.com https://*.clerk.com https://*.clerk.accounts.dev",

  // Workers
  "worker-src 'self' blob:",

  // Manifests
  "manifest-src 'self'",

  // Block plugins (Flash, Java, etc.)
  "object-src 'none'",

  // Block <base> tag hijacking
  "base-uri 'self'",

  // Block form submissions to external domains
  "form-action 'self'",

  // Prevent this site from being framed by others
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
