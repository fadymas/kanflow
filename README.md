# KanFlow

> A real-time Kanban task management app built with Next.js 16, featuring drag-and-drop, secure authentication, and a clean responsive UI.

![Version](https://img.shields.io/badge/version-0.3.0-635fc7?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-private-gray?style=flat-square)

---

## Features

- **Boards** — Create, edit, and delete multiple Kanban boards
- **Columns** — Organize work into custom columns per board
- **Tasks** — Full CRUD with title, description, and subtasks
- **Drag & Drop** — Reorder tasks and move them across columns
- **Subtasks** — Toggle subtask completion with optimistic updates
- **Authentication** — Secure sign-in / sign-up powered by Clerk
- **Dark Mode** — Full light/dark theme support
- **Responsive** — Works on desktop and mobile
- **Rate Limiting** — Per-IP API rate limiting via Upstash Redis
- **Security** — CSP, CORS, HSTS, and security headers configured

---

## Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | Next.js 16 (App Router)           |
| Language         | TypeScript 5                      |
| Styling          | Tailwind CSS 4                    |
| UI Components    | shadcn/ui, Radix UI, Base UI      |
| Auth             | Clerk                             |
| Database         | PostgreSQL via Prisma             |
| ORM              | Prisma                            |
| State Management | Zustand (vanilla store + persist) |
| Server State     | TanStack React Query v5           |
| Drag & Drop      | @hello-pangea/dnd                 |
| Rate Limiting    | Upstash Redis                     |
| Font             | Plus Jakarta Sans                 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account
- Upstash Redis account (optional — for rate limiting)

### Installation

```bash
# Clone the repository
git clone https://github.com/fadymas/kanflow.git
cd kanflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root with the following:

```env
# App
NEXT_PUBLIC_URL=http://localhost:3000

# Database
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_direct_postgresql_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/board
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/board
CLERK_WEBHOOK_SECRET=whsec_...

# Upstash Redis (optional — rate limiting)
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### Database Setup

```bash
# Run Prisma migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio
npx prisma studio
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
kanban-task-management/
├── app/
│   ├── (app)/board/         # Protected board page
│   ├── (auth)/              # Sign-in, sign-up, user profile
│   ├── (marketing)/         # Landing page
│   ├── api/                 # REST API routes
│   ├── layout.tsx           # Root layout with metadata
│   ├── robots.ts            # SEO robots
│   └── sitemap.ts           # SEO sitemap
├── components/
│   ├── app/                 # Board, Column, TaskCard, dialogs
│   │   └── skeletons/       # Loading skeletons
│   ├── navigation/          # Sidebar, header
│   └── ui/                  # shadcn/ui primitives
├── lib/                     # Utilities and server helpers
├── mocks/                   # Type definitions / mock models
├── prisma/                  # Schema and migrations
├── providers/               # React Query, Zustand providers
├── public/                  # Static assets and illustrations
├── next.config.ts           # Next.js config with CSP + CORS
└── proxy.ts                 # Clerk middleware + rate limiting
```

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Roadmap

- [ ] Real-time collaboration (WebSockets / Supabase Realtime)
- [ ] Team workspaces with role-based access
- [ ] Task assignment to team members
- [ ] Comments on tasks
- [ ] File attachments
- [ ] In-app notifications

---

## License

Private project. All rights reserved.
