"use client";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
export function ExportEvents(){const params=useSearchParams();return <a className="button secondary" href={`/api/events/export?${params.toString()}`}><Download size={15} style={{verticalAlign:"-2px",marginRight:6}}/>Export Excel</a>}
