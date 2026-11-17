# Architecture

`Adapter → extraction → sanitize/normalize → validate → classify/score → Postgres upsert → API/UI`.

Each adapter runs in its own error boundary. A failed source is marked `degraded`; previously ingested events remain active. The sync uses a PostgreSQL advisory lock, and `events.canonical_key` has a unique constraint, making retries idempotent. Relevance uses transparent rules: networking intent (25), technical/category relevance (30), field quality (20), time proximity (15), and accessibility/free attendance (10), clamped to 0–100.
