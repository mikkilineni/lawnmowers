/**
 * One-time data migration to support schema improvements.
 * Run BEFORE updating prisma/schema.prisma and running db push.
 *
 * Usage: DATABASE_URL=... npx tsx scripts/migrate-schema.ts
 */
import { neon } from "@neondatabase/serverless";
import { config as loadEnv } from "dotenv";
import * as path from "path";

loadEnv({ path: path.resolve(process.cwd(), ".env") });

const sql = neon(process.env.DATABASE_URL!);

async function run() {
  console.log("Starting schema data migration...\n");

  // ── 1. tags: JSON string → TEXT[] ──────────────────────────────────────
  console.log("1. Converting Product.tags (JSON string → TEXT[])...");
  await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "tags_new" TEXT[] NOT NULL DEFAULT '{}'`;
  await sql`
    UPDATE "Product"
    SET "tags_new" = ARRAY(
      SELECT jsonb_array_elements_text(
        CASE WHEN "tags" ~ '^\\[' THEN "tags"::jsonb ELSE '[]'::jsonb END
      )
    )
  `;
  await sql`ALTER TABLE "Product" DROP COLUMN "tags"`;
  await sql`ALTER TABLE "Product" RENAME COLUMN "tags_new" TO "tags"`;
  console.log("   ✓ tags done");

  // ── 2. categories: JSON string → TEXT[] ────────────────────────────────
  console.log("2. Converting Product.categories (JSON string → TEXT[])...");
  await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categories_new" TEXT[] NOT NULL DEFAULT '{}'`;
  await sql`
    UPDATE "Product"
    SET "categories_new" = ARRAY(
      SELECT jsonb_array_elements_text(
        CASE WHEN "categories" ~ '^\\[' THEN "categories"::jsonb ELSE '[]'::jsonb END
      )
    )
  `;
  await sql`ALTER TABLE "Product" DROP COLUMN "categories"`;
  await sql`ALTER TABLE "Product" RENAME COLUMN "categories_new" TO "categories"`;
  console.log("   ✓ categories done");

  // ── 3. pros: newline string → TEXT[] ───────────────────────────────────
  console.log("3. Converting Product.pros (newline string → TEXT[])...");
  await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "pros_new" TEXT[] NOT NULL DEFAULT '{}'`;
  await sql`
    UPDATE "Product"
    SET "pros_new" = string_to_array(trim("pros"), E'\n')
    WHERE "pros" != '' AND "pros" IS NOT NULL
  `;
  await sql`UPDATE "Product" SET "pros_new" = array_remove("pros_new", '')`;
  await sql`UPDATE "Product" SET "pros_new" = array_remove("pros_new", ' ')`;
  await sql`ALTER TABLE "Product" DROP COLUMN "pros"`;
  await sql`ALTER TABLE "Product" RENAME COLUMN "pros_new" TO "pros"`;
  console.log("   ✓ pros done");

  // ── 4. cons: newline string → TEXT[] ───────────────────────────────────
  console.log("4. Converting Product.cons (newline string → TEXT[])...");
  await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "cons_new" TEXT[] NOT NULL DEFAULT '{}'`;
  await sql`
    UPDATE "Product"
    SET "cons_new" = string_to_array(trim("cons"), E'\n')
    WHERE "cons" != '' AND "cons" IS NOT NULL
  `;
  await sql`UPDATE "Product" SET "cons_new" = array_remove("cons_new", '')`;
  await sql`UPDATE "Product" SET "cons_new" = array_remove("cons_new", ' ')`;
  await sql`ALTER TABLE "Product" DROP COLUMN "cons"`;
  await sql`ALTER TABLE "Product" RENAME COLUMN "cons_new" TO "cons"`;
  console.log("   ✓ cons done");

  // ── 5. specsJson: TEXT → JSONB ──────────────────────────────────────────
  console.log("5. Converting Product.specsJson (TEXT → JSONB)...");
  await sql`ALTER TABLE "Product" ALTER COLUMN "specsJson" DROP DEFAULT`;
  await sql`ALTER TABLE "Product" ALTER COLUMN "specsJson" TYPE JSONB USING "specsJson"::JSONB`;
  await sql`ALTER TABLE "Product" ALTER COLUMN "specsJson" SET DEFAULT '{}'::JSONB`;
  console.log("   ✓ specsJson done");

  // ── 6. extrasJson: TEXT → JSONB ─────────────────────────────────────────
  console.log("6. Converting Product.extrasJson (TEXT → JSONB)...");
  await sql`ALTER TABLE "Product" ALTER COLUMN "extrasJson" DROP DEFAULT`;
  await sql`ALTER TABLE "Product" ALTER COLUMN "extrasJson" TYPE JSONB USING "extrasJson"::JSONB`;
  await sql`ALTER TABLE "Product" ALTER COLUMN "extrasJson" SET DEFAULT '{}'::JSONB`;
  console.log("   ✓ extrasJson done");

  // ── 7. slug: remove empty-string default, allow NULL ───────────────────
  console.log("7. Fixing Product.slug (empty string → NULL, allow nullable)...");
  await sql`UPDATE "Product" SET "slug" = NULL WHERE "slug" = ''`;
  await sql`ALTER TABLE "Product" ALTER COLUMN "slug" DROP DEFAULT`;
  await sql`ALTER TABLE "Product" ALTER COLUMN "slug" DROP NOT NULL`;
  console.log("   ✓ slug done");

  // ── 8. Review: add createdAt ────────────────────────────────────────────
  console.log("8. Adding Review.createdAt...");
  await sql`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`;
  console.log("   ✓ createdAt done");

  console.log("\n✅ Migration complete.");
}

run().catch(e => { console.error(e); process.exit(1); });
