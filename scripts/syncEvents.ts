import { synchronizeEvents } from "../lib/ingestion";
synchronizeEvents().then(console.log).catch((e) => { console.error(e); process.exitCode = 1; });
