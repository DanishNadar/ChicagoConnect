import { NextResponse } from "next/server"; import { CATEGORIES } from "@/lib/types"; export async function GET(){return NextResponse.json({data:CATEGORIES})}
