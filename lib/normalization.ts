import sanitizeHtml from "sanitize-html";
import { createHash } from "crypto";
export const CHICAGO_TZ = "America/Chicago";
export function canonicalUrl(value: string) { try { const u = new URL(value); u.hash = ""; ["utm_source","utm_medium","utm_campaign","fbclid","gclid"].forEach(k => u.searchParams.delete(k)); return u.toString().replace(/\/$/, ""); } catch { return value; } }
export function eventKey(title: string, start: Date, url: string) { return createHash("sha256").update(`${title.toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}|${start.toISOString().slice(0,16)}|${canonicalUrl(url)}`).digest("hex"); }
export function cleanText(value?: string) { return value ? sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g," ").trim() || null : null; }
export function neighborhood(location?: string) { const lower = location?.toLowerCase() ?? ""; return ["loop","river north","west loop","wicker park","hyde park","lincoln park","fulton market","logan square"].find(n => lower.includes(n)) ?? null; }
export function validOutboundUrl(value: string) { try { const u = new URL(value); return u.protocol === "https:" || u.protocol === "http:"; } catch { return false; } }
