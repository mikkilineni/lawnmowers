# Lawnmowers.com

Next.js 15 affiliate review site for lawn mowers. App Router, Prisma ORM, PostgreSQL (Neon), deployed on Vercel.

## Environment

- **Platform**: Windows 11, Claude Code via bash (Git Bash / MSYS2)
- **Shell syntax**: Unix-style paths and commands

## Setup

```bash
npm install
npm run dev
```

Database is Neon (serverless PostgreSQL). Connection string in `.env` as `DATABASE_URL`.

## Database

- ORM: Prisma with `@prisma/adapter-neon`
- Schema: `prisma/schema.prisma`
- **Use `npx prisma db push`** (not `migrate dev`) — migration history is out of sync with the DB
- After schema changes: `npx prisma generate`
- Seed specs: `DATABASE_URL=... npx tsx prisma/seed-specs.ts`

## Architecture

```
src/
  app/              # Next.js App Router pages + API routes
    admin/          # Admin UI (products, guides, affiliate links)
    api/            # REST endpoints
    compare/        # Side-by-side comparison page
    guides/[slug]/  # Guide article pages
    reviews/[slug]/ # Product review pages
  components/       # Shared React components
  types/specs.ts    # ProductSpecs interface
lib/prisma.ts       # Prisma client singleton
prisma/
  schema.prisma
  seed-specs.ts     # One-time script to populate specsJson
```

## Key Patterns

- Server components fetch from Prisma directly; client components use `/api` routes
- `searchParams` is a `Promise` in Next.js 15 — always `await` it
- Dynamic pages use `export const dynamic = "force-dynamic"`
- Product tags/categories stored as JSON strings in DB, parsed on read
- `specsJson` on Product stores a `ProductSpecs` object (see `src/types/specs.ts`)
- Compare state shared via `CompareProvider` context (localStorage-backed, max 4 items)

## Admin

Located at `/admin`. Key pages:
- `/admin/products` — add/edit products, generate reviews, edit specs
- `/admin/guides` — manage guides with TipTap HTML editor
- `/admin/affiliate-links` — manage buy links per product

Add under a ## Deployment section in CLAUDE.md\n\nWhen working with Next.js projects, always verify Prisma client generation, middleware compatibility with the current Next.js version, and dynamic export requirements before deploying to Vercel.
Add at the top of CLAUDE.md under ## Tech Stack\n\nPrimary tech stack: TypeScript (Next.js), Python. Always use TypeScript for web projects unless otherwise specified.
Add under ## Workflow Rules section in CLAUDE.md\n\nAfter making code changes, always run the build (`npm run build` or equivalent) and fix any errors before considering the task complete. Do not wait for the user to discover build failures.