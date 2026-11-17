import ExcelJS from "exceljs";

type ExportEvent = { title:string; description:string|null; organizer:string|null; startDate:Date; endDate:Date|null; timezone:string; venueName:string|null; streetAddress:string|null; neighborhood:string|null; city:string; state:string; categories:string[]; tags:string[]; isFree:boolean|null; priceMin:number|null; priceMax:number|null; currency:string|null; registrationUrl:string; sourceUrl:string; sourceName:string; relevanceScore:number; status:string; lastVerifiedAt:Date|null };
const chicagoDate = (value: Date | null) => value ? new Intl.DateTimeFormat("en-US", { timeZone:"America/Chicago", dateStyle:"medium", timeStyle:"short" }).format(value) : null;

export async function buildEventWorkbook(events: ExportEvent[], filters: Record<string, string | undefined>) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Chicago Connect";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Networking events", { views:[{ state:"frozen", ySplit:1 }] });
  sheet.columns = [
    { header:"Event", key:"title", width:34 }, { header:"Start (Chicago)", key:"start", width:21 }, { header:"End (Chicago)", key:"end", width:21 },
    { header:"Organizer", key:"organizer", width:24 }, { header:"Venue", key:"venue", width:28 }, { header:"Address", key:"address", width:30 },
    { header:"Neighborhood", key:"neighborhood", width:18 }, { header:"Categories", key:"categories", width:30 }, { header:"Tags", key:"tags", width:24 },
    { header:"Free", key:"free", width:10 }, { header:"Price min", key:"priceMin", width:12 }, { header:"Price max", key:"priceMax", width:12 }, { header:"Currency", key:"currency", width:10 },
    { header:"Relevance", key:"relevance", width:12 }, { header:"Registration", key:"registration", width:45 }, { header:"Source", key:"source", width:25 }, { header:"Source URL", key:"sourceUrl", width:45 }, { header:"Last verified", key:"verified", width:21 }, { header:"Description", key:"description", width:60 },
  ];
  for (const event of events) sheet.addRow({ title:event.title, start:chicagoDate(event.startDate), end:chicagoDate(event.endDate), organizer:event.organizer, venue:event.venueName, address:[event.streetAddress,event.city,event.state].filter(Boolean).join(", "), neighborhood:event.neighborhood, categories:event.categories.join("; "), tags:event.tags.join("; "), free:event.isFree===null?"Unknown":event.isFree?"Yes":"No", priceMin:event.priceMin, priceMax:event.priceMax, currency:event.currency, relevance:event.relevanceScore, registration:event.registrationUrl, source:event.sourceName, sourceUrl:event.sourceUrl, verified:chicagoDate(event.lastVerifiedAt), description:event.description });
  sheet.getRow(1).height = 26; sheet.getRow(1).font = { bold:true, color:{ argb:"FFFFFFFF" } }; sheet.getRow(1).fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF10243D" } }; sheet.getRow(1).alignment = { vertical:"middle" };
  sheet.autoFilter = { from:"A1", to:`S${Math.max(1, events.length + 1)}` };
  sheet.getColumn("priceMin").numFmt = "$0.00"; sheet.getColumn("priceMax").numFmt = "$0.00";
  ["registration", "sourceUrl"].forEach(key => sheet.getColumn(key).eachCell((cell, row) => { if (row > 1 && cell.value) { cell.value = { text:String(cell.value), hyperlink:String(cell.value) }; cell.font = { color:{ argb:"FF2563EB" }, underline:true }; } }));
  const info = workbook.addWorksheet("Export information"); info.columns = [{ width:28 }, { width:76 }]; info.getCell("A1").value = "Chicago Connect export"; info.mergeCells("A1:B1"); info.getCell("A1").font = { bold:true, size:16, color:{ argb:"FFFFFFFF" } }; info.getCell("A1").fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF10243D" } }; info.addRows([["Generated", new Date().toLocaleString("en-US", { timeZone:"America/Chicago" })], ["Records exported", events.length], ["Applied filters", Object.entries(filters).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join(" · ") || "None"], ["Scope", "Verified active networking-event records available in Chicago Connect. Standalone initiatives are not currently stored separately."]]); info.getColumn(2).alignment = { wrapText:true, vertical:"top" };
  return workbook.xlsx.writeBuffer();
}
