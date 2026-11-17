import { boolean, doublePrecision, index, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  canonicalKey: varchar("canonical_key", { length: 512 }).notNull().unique(),
  title: text("title").notNull(), description: text("description"), organizer: text("organizer"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(), endDate: timestamp("end_date", { withTimezone: true }),
  timezone: varchar("timezone", { length: 64 }).notNull().default("America/Chicago"), venueName: text("venue_name"), streetAddress: text("street_address"), neighborhood: text("neighborhood"),
  city: varchar("city", { length: 100 }).notNull().default("Chicago"), state: varchar("state", { length: 32 }).notNull().default("IL"), latitude: doublePrecision("latitude"), longitude: doublePrecision("longitude"),
  categories: jsonb("categories").$type<string[]>().notNull().default([]), tags: jsonb("tags").$type<string[]>().notNull().default([]),
  isFree: boolean("is_free"), priceMin: doublePrecision("price_min"), priceMax: doublePrecision("price_max"), currency: varchar("currency", { length: 3 }),
  registrationUrl: text("registration_url").notNull(), sourceUrl: text("source_url").notNull(), sourceName: text("source_name").notNull(), imageUrl: text("image_url"),
  relevanceScore: integer("relevance_score").notNull().default(0), firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(), lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(), lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
  status: varchar("status", { length: 16 }).notNull().default("active"), extractionConfidence: integer("extraction_confidence").notNull().default(0),
}, (t) => [index("events_start_date_idx").on(t.startDate), index("events_status_idx").on(t.status), index("events_score_idx").on(t.relevanceScore)]);

export const eventSourceLinks = pgTable("event_source_links", { id: uuid("id").defaultRandom().primaryKey(), eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }), sourceId: text("source_id").notNull(), externalId: text("external_id"), sourceUrl: text("source_url").notNull(), discoveredAt: timestamp("discovered_at", { withTimezone: true }).notNull().defaultNow() });
export const eventSources = pgTable("event_sources", { id: text("id").primaryKey(), name: text("name").notNull(), status: text("status").notNull(), lastSuccessAt: timestamp("last_success_at", { withTimezone: true }), lastError: text("last_error"), config: jsonb("config").$type<Record<string, unknown>>().default({}) });
export const ingestionRuns = pgTable("ingestion_runs", { id: uuid("id").defaultRandom().primaryKey(), startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(), endedAt: timestamp("ended_at", { withTimezone: true }), status: text("status").notNull(), sourcesAttempted: integer("sources_attempted").notNull().default(0), discovered: integer("discovered").notNull().default(0), inserted: integer("inserted").notNull().default(0), updated: integer("updated").notNull().default(0), duplicates: integer("duplicates").notNull().default(0), errors: integer("errors").notNull().default(0), lockToken: text("lock_token") });
export const ingestionErrors = pgTable("ingestion_errors", { id: uuid("id").defaultRandom().primaryKey(), runId: uuid("run_id").references(() => ingestionRuns.id), sourceId: text("source_id").notNull(), message: text("message").notNull(), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() });
export const userPreferences = pgTable("user_preferences", { id: uuid("id").defaultRandom().primaryKey(), anonymousId: varchar("anonymous_id", { length: 128 }).unique(), interests: jsonb("interests").$type<string[]>().notNull().default([]), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow() });
