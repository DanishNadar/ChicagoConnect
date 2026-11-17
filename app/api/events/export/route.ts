import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildEventWorkbook } from "@/lib/excel-export";
import { listEvents } from "@/lib/events";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const query = z.object({ q:z.string().max(120).optional(), category:z.string().max(80).optional(), free:z.enum(["true","false"]).optional(), source:z.string().max(80).optional(), interests:z.string().max(500).optional(), sort:z.enum(["soonest","relevant","newest","free"]).optional() });
export async function GET(request:NextRequest) { const parsed=query.safeParse(Object.fromEntries(request.nextUrl.searchParams)); if (!parsed.success) return NextResponse.json({error:"Invalid export filters",details:parsed.error.flatten()},{status:400}); const result=await listEvents({ ...parsed.data, interests:parsed.data.interests?.split(",").filter(Boolean), free:parsed.data.free==="true", limit:10_000 }); const buffer=await buildEventWorkbook(result.items, parsed.data); const date=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Chicago"}).format(new Date()); return new Response(buffer as BodyInit,{headers:{"content-type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","content-disposition":`attachment; filename="chicago-connect-events-${date}.xlsx"`,"cache-control":"private, no-store"}}); }
