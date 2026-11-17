# Deployment

Set the `.env.example` values in Vercel, provision a Supabase project, and execute `db/migrations/0000_initial.sql` in Supabase SQL Editor. Vercel runs `/api/cron/sync-events` at 12:00 UTC daily after deployment and supplies `Authorization: Bearer $CRON_SECRET` when that environment variable is configured. Verify a completed run in `/pipeline` before calling the scheduler operational.
