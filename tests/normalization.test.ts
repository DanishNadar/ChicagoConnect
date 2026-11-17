import { describe, expect, it } from "vitest";
import { canonicalUrl, eventKey, validOutboundUrl } from "@/lib/normalization";
import { classify, scoreEvent } from "@/lib/classification";

describe("normalization", () => {
  it("canonicalizes tracking URLs", () => expect(canonicalUrl("https://example.com/event/?utm_source=x#top")).toBe("https://example.com/event"));
  it("makes deterministic keys", () => expect(eventKey("AI Meetup", new Date("2026-01-01T18:00:00Z"), "https://a.com")).toBe(eventKey("AI Meetup", new Date("2026-01-01T18:00:00Z"), "https://a.com")));
  it("blocks malformed outbound URLs", () => expect(validOutboundUrl("javascript:alert(1)")).toBe(false));
  it("classifies multiple signals", () => expect(classify("AI startup founder networking mixer")).toEqual(expect.arrayContaining(["AI / Machine Learning", "Startups", "Business Networking"])));
  it("scores bounded relevance", () => expect(scoreEvent({ title:"AI Networking", description:"Meet engineers", categories:["AI / Machine Learning"], isFree:true, organizer:"Chicago AI", startDate:new Date(Date.now()+864e5) })).toBeLessThanOrEqual(100));
});
