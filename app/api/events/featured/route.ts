import { NextResponse } from "next/server"; import { listEvents } from "@/lib/events"; export async function GET(){return NextResponse.json(await listEvents({sort:"relevant",limit:6}))}
