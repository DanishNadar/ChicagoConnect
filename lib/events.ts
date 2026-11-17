import { and, asc, desc, eq, gte, ilike, isNull, lt, or, sql } from "drizzle-orm";
import { events, eventSources, ingestionRuns } from "@/db/schema";
import { db } from "@/lib/database";
import type { NetworkingEvent } from "@/lib/types";

export type EventFilters = { q?: string; category?: string; free?: boolean; source?: string; from?: Date; to?: Date; sort?: "soonest" | "relevant" | "newest" | "free"; page?: number; limit?: number; interests?: string[] };
export async function listEvents(filters: EventFilters = {}) {
  if (!db) return { items: [], total: 0, page: 1, limit: filters.limit ?? 12 };
  const where = [eq(events.status, "active"), or(isNull(events.endDate), gte(events.endDate, new Date()))];
  if (filters.q) where.push(ilike(events.title, `%${filters.q.trim()}%`));
  if (filters.category) where.push(sql`${events.categories} ? ${filters.category}`);
  if (filters.free) where.push(eq(events.isFree, true));
  if (filters.source) where.push(eq(events.sourceName, filters.source));
  if (filters.from) where.push(gte(events.startDate, filters.from)); if (filters.to) where.push(lt(events.startDate, filters.to));
  const page = Math.max(1, filters.page ?? 1), limit = Math.min(10_000, Math.max(1, filters.limit ?? 12));
  const order = filters.sort === "newest" ? desc(events.firstSeenAt) : filters.sort === "free" ? desc(events.isFree) : filters.sort === "relevant" ? desc(events.relevanceScore) : asc(events.startDate);
  const [items, count] = await Promise.all([db.select().from(events).where(and(...where)).orderBy(order).limit(limit).offset((page - 1) * limit), db.select({ count: sql<number>`count(*)` }).from(events).where(and(...where))]);
  const ranked = filters.interests?.length ? [...items].sort((a, b) => (b.relevanceScore + b.categories.filter(c => filters.interests!.includes(c)).length * 18) - (a.relevanceScore + a.categories.filter(c => filters.interests!.includes(c)).length * 18)) : items;
  return { items: ranked, total: Number(count[0]?.count ?? 0), page, limit };
}
export async function eventById(id: string) { return db ? (await db.select().from(events).where(eq(events.id, id)).limit(1))[0] ?? null : null; }
export async function getStats() { if (!db) return { upcoming: 0, free: 0, thisWeek: 0, sources: 0, lastSync: null }; const now = new Date(), nextWeek = new Date(Date.now() + 7 * 864e5); const [all, free, week, sources, run] = await Promise.all([db.select({ c: sql<number>`count(*)` }).from(events).where(and(eq(events.status,"active"),gte(events.startDate,now))), db.select({ c: sql<number>`count(*)` }).from(events).where(and(eq(events.status,"active"),eq(events.isFree,true),gte(events.startDate,now))), db.select({ c: sql<number>`count(*)` }).from(events).where(and(eq(events.status,"active"),gte(events.startDate,now),lt(events.startDate,nextWeek))), db.select({ c: sql<number>`count(*)` }).from(eventSources).where(eq(eventSources.status,"active")), db.select().from(ingestionRuns).where(eq(ingestionRuns.status,"success")).orderBy(desc(ingestionRuns.endedAt)).limit(1)]); return { upcoming:Number(all[0]?.c??0), free:Number(free[0]?.c??0), thisWeek:Number(week[0]?.c??0), sources:Number(sources[0]?.c??0), lastSync:run[0]?.endedAt??null }; }
export async function upsertEvent(event: NetworkingEvent) { if (!db) throw new Error("DATABASE_URL is required for ingestion."); const inserted = await db.insert(events).values({ ...event, id: undefined, firstSeenAt: undefined, lastSeenAt: new Date(), lastVerifiedAt: new Date() }).onConflictDoUpdate({ target: events.canonicalKey, set: { title:event.title, description:event.description, startDate:event.startDate, endDate:event.endDate, venueName:event.venueName, categories:event.categories, tags:event.tags, registrationUrl:event.registrationUrl, sourceUrl:event.sourceUrl, relevanceScore:event.relevanceScore, lastSeenAt:new Date(), lastVerifiedAt:new Date(), status:"active" } }).returning({ id: events.id }); return inserted[0].id; }
