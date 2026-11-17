import { eq, sql } from "drizzle-orm";
import { eventSourceLinks, eventSources, ingestionErrors, ingestionRuns } from "@/db/schema";
import { db } from "@/lib/database";
import { adapters } from "@/lib/extraction";
import { upsertEvent } from "@/lib/events";

export async function synchronizeEvents() {
  if (!db) throw new Error("DATABASE_URL is required.");
  const locked = await db.execute(sql`select pg_try_advisory_lock(248113) as locked`); if (!locked[0]?.locked) return { status:"already_running" as const };
  const [run] = await db.insert(ingestionRuns).values({ status:"running", sourcesAttempted:adapters.length }).returning(); let discovered=0, inserted=0, updated=0, errors=0;
  try { for (const adapter of adapters) { try { const raw = await adapter.fetchEvents(); const valid = await adapter.validateEvents(await adapter.normalizeEvents(raw)); discovered += valid.length; for (const event of valid) { const id = await upsertEvent(event); await db.insert(eventSourceLinks).values({ eventId:id,sourceId:adapter.sourceId,externalId:event.externalId,sourceUrl:event.sourceUrl }).onConflictDoNothing(); inserted++; } await db.insert(eventSources).values({id:adapter.sourceId,name:adapter.sourceName,status:"active",lastSuccessAt:new Date()}).onConflictDoUpdate({target:eventSources.id,set:{status:"active",lastSuccessAt:new Date(),lastError:null}}); } catch (error) { errors++; const message = error instanceof Error ? error.message : "Unknown adapter failure"; await db.insert(ingestionErrors).values({runId:run.id,sourceId:adapter.sourceId,message}); await db.insert(eventSources).values({id:adapter.sourceId,name:adapter.sourceName,status:"degraded",lastError:message}).onConflictDoUpdate({target:eventSources.id,set:{status:"degraded",lastError:message}}); } }
    await db.update(ingestionRuns).set({status: errors === adapters.length ? "failed" : "success",endedAt:new Date(),discovered,inserted,updated,errors}).where(eq(ingestionRuns.id,run.id)); return { status: errors === adapters.length ? "failed" as const : "success" as const, runId:run.id, discovered, inserted, updated, errors };
  } finally { await db.execute(sql`select pg_advisory_unlock(248113)`); }
}
