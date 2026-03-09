import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL);
await sql`INSERT INTO "Setting" (key, value) VALUES ('adsEnabled', 'false') ON CONFLICT (key) DO NOTHING`;
console.log("✅ Default settings seeded.");
