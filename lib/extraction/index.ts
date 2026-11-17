import { chicagoInfosecAdapter } from "@/lib/extraction/adapters/chicagoInfosec";
import { ticketmasterAdapter } from "@/lib/extraction/adapters/ticketmaster";
export const adapters = [chicagoInfosecAdapter, ...(process.env.TICKETMASTER_API_KEY ? [ticketmasterAdapter] : [])];
