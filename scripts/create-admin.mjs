import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env" });

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const passwordHash = await bcrypt.hash(password, 12);

try {
  await sql`
    INSERT INTO "AdminUser" (email, "passwordHash", "createdAt")
    VALUES (${email.toLowerCase().trim()}, ${passwordHash}, NOW())
    ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash"
  `;
  console.log(`✅ Admin user "${email}" created/updated successfully.`);
} catch (err) {
  console.error("Error:", err.message);
}
