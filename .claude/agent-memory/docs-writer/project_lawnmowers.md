---
name: lawnmowers_project_context
description: Architecture, tech stack, and documentation conventions for the Lawnmowers.com project
type: project
---

Lawnmowers.com is a Next.js 15 affiliate review site for lawn mowers. App Router, Prisma ORM with @prisma/adapter-neon, PostgreSQL via Neon, deployed on Vercel. Primary language is TypeScript for web code; Python for the search/keyword monitor in `search/`.

Scripts live in `scripts/` and are run with `npx tsx`. The ingestion script `scripts/ingest.ts` is the main data pipeline tool — documented in `scripts/INGEST.md`.

**Why:** The project uses serverless Neon postgres which requires the PrismaNeon adapter; standard PrismaClient initialization will not work in this environment.

**How to apply:** When writing or updating docs that mention DB setup, note the adapter requirement and that `npx prisma db push` (not `migrate dev`) is the correct schema sync command.
