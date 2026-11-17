# Chicago Connect

Chicago Connect is a Next.js event-discovery service with a live, public Chicago InfoSec ICS adapter, optional Ticketmaster Discovery API adapter, PostgreSQL persistence, secured sync routes, and a responsive discovery UI.

## Run locally

1. Copy `.env.example` to `.env.local` and set a Supabase Postgres `DATABASE_URL` plus both secrets.
2. Run `npm install` and execute `db/migrations/0000_initial.sql` in Supabase SQL Editor.
3. Run `npm run dev`, then populate records using `npm run sync` or `POST /api/admin/sync` with `Authorization: Bearer $ADMIN_SYNC_SECRET`.
4. Visit `/`, `/explore`, `/calendar`, and `/pipeline`.

## Operations

`vercel.json` schedules daily ingestion for 12:00 UTC. The cron route requires `CRON_SECRET`; admin refresh requires `ADMIN_SYNC_SECRET`; neither secret reaches the browser. Add the free `TICKETMASTER_API_KEY` to activate the official Ticketmaster adapter. Run `npm test` for deterministic classification, URL, and authorization tests and `npm run build` before deployment.

## Excel exports

Use **Export Excel** from Explore to download the current filtered event set as an `.xlsx` workbook. It contains a filterable networking-events sheet with Chicago-local dates, categories, price, relevance, source attribution, and clickable registration/source links, plus an export-information sheet. Chicago Connect currently stores networking events—not standalone initiatives—so the workbook clearly records that scope.

See [source research](docs/sources.md), [architecture](docs/architecture.md), and [deployment](docs/deployment.md). Add a source by implementing `EventSourceAdapter` and registering it in `lib/extraction/index.ts`.
