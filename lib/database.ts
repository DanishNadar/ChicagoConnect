import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const url = process.env.DATABASE_URL;
export const db = url ? drizzle(postgres(url, { prepare: false, max: 3 }), { schema }) : null;
export const databaseConfigured = Boolean(url);
