/**
 * Product Data Ingestion Script
 *
 * Strategies (tried in order):
 *   1. JSON-LD / Open Graph structured data from a URL
 *   2. Sitemap XML discovery → crawl product URLs for structured data
 *   3. CSV file fallback
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/ingest.ts --url   https://example.com/product-page
 *   DATABASE_URL=... npx tsx scripts/ingest.ts --sitemap https://example.com
 *   DATABASE_URL=... npx tsx scripts/ingest.ts --csv   ./products.csv
 *
 * Options:
 *   --dry-run   Print products without writing to DB
 *   --limit N   Max products to upsert (default: 50)
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { parse as parseHtml } from "node-html-parser";
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

loadEnv({ path: path.resolve(process.cwd(), ".env") });

// ── Prisma client (Node-compatible) ─────────────────────────────────────────

function makePrisma() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter } as any);
}
const prisma = makePrisma();

// ── Types ────────────────────────────────────────────────────────────────────

interface IngestedProduct {
  name: string;
  brand: string;
  price: string;
  originalPrice: string;
  image: string;
  description: string;
  categories: string[];
  tags: string[];
  sourceUrl?: string;
}

// ── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };
  return {
    url:     get("--url"),
    sitemap: get("--sitemap"),
    csv:     get("--csv"),
    dryRun:  args.includes("--dry-run"),
    limit:   parseInt(get("--limit") ?? "50"),
  };
}

// ── HTTP with exponential backoff ────────────────────────────────────────────

const UA = "Mozilla/5.0 (compatible; LawnmowersBot/1.0; +https://lawnmowers.com)";

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      const wait = Math.pow(2, attempt) * 1000;
      log(`  ↺ retry ${attempt}/${maxRetries - 1} after ${wait}ms…`);
      await sleep(wait);
    }
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
        signal: AbortSignal.timeout(12_000),
      });
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

// ── Logging ──────────────────────────────────────────────────────────────────

function log(msg: string) { process.stdout.write(msg + "\n"); }
function ok(msg: string)  { log(`  ✓ ${msg}`); }
function warn(msg: string){ log(`  ⚠ ${msg}`); }
function fail(msg: string){ log(`  ✗ ${msg}`); }

// ── Strategy 1: JSON-LD + Open Graph ─────────────────────────────────────────

function extractJsonLd(html: string): IngestedProduct[] {
  const results: IngestedProduct[] = [];
  const root = parseHtml(html);
  const scripts = root.querySelectorAll('script[type="application/ld+json"]');

  for (const s of scripts) {
    try {
      const data = JSON.parse(s.text);
      const items: unknown[] = Array.isArray(data) ? data
        : data["@graph"] ? data["@graph"] as unknown[]
        : [data];

      for (const item of items) {
        const obj = item as Record<string, unknown>;
        const type = String(obj["@type"] ?? "");
        if (!type.toLowerCase().includes("product")) continue;

        const name = String(obj.name ?? "").trim();
        if (!name) continue;

        const brand = typeof obj.brand === "object" && obj.brand
          ? String((obj.brand as Record<string, unknown>).name ?? "")
          : String(obj.brand ?? "");

        // Price: may be in offers
        let price = "";
        const offers = obj.offers ?? obj.Offers;
        if (offers && typeof offers === "object") {
          const o = (Array.isArray(offers) ? offers[0] : offers) as Record<string, unknown>;
          const p = o.price ?? o.lowPrice;
          if (p != null) price = `$${Number(p).toFixed(2)}`;
        }

        const image = (() => {
          const img = obj.image;
          if (typeof img === "string") return img;
          if (Array.isArray(img) && img.length) return String(img[0]);
          if (img && typeof img === "object") return String((img as Record<string, unknown>).url ?? "");
          return "";
        })();

        const description = String(obj.description ?? "").replace(/<[^>]+>/g, "").slice(0, 1000);

        const cats: string[] = [];
        if (obj.category) cats.push(...String(obj.category).split(/[,>\/]/).map(c => c.trim()).filter(Boolean));

        results.push({ name, brand, price, originalPrice: price, image, description, categories: cats, tags: [] });
      }
    } catch { /* malformed JSON-LD — skip */ }
  }
  return results;
}

function extractOpenGraph(html: string, url: string): IngestedProduct | null {
  const root = parseHtml(html);
  const meta = (prop: string) =>
    root.querySelector(`meta[property="${prop}"]`)?.getAttribute("content")
    ?? root.querySelector(`meta[name="${prop}"]`)?.getAttribute("content")
    ?? "";

  const type = meta("og:type");
  if (type && !type.includes("product")) return null;

  const name = meta("og:title") || root.querySelector("h1")?.text?.trim() || "";
  if (!name) return null;

  const priceRaw = meta("product:price:amount") || meta("og:price:amount") || "";
  const price = priceRaw ? `$${parseFloat(priceRaw).toFixed(2)}` : "";

  const image = meta("og:image");
  const description = meta("og:description").slice(0, 1000);
  const brand = meta("og:site_name") || new URL(url).hostname.replace(/^www\./, "");

  return { name, brand, price, originalPrice: price, image, description, categories: [], tags: [], sourceUrl: url };
}

async function strategyStructuredData(url: string): Promise<IngestedProduct[]> {
  log(`\n[Strategy 1] Fetching structured data from: ${url}`);
  let html: string;
  try {
    const res = await fetchWithRetry(url);
    html = await res.text();
  } catch (e) {
    fail(`Could not fetch URL: ${(e as Error).message}`);
    return [];
  }

  const ldProducts = extractJsonLd(html);
  if (ldProducts.length > 0) {
    ok(`Found ${ldProducts.length} product(s) via JSON-LD`);
    return ldProducts.map(p => ({ ...p, sourceUrl: url }));
  }

  warn("No JSON-LD products found. Trying Open Graph…");
  const og = extractOpenGraph(html, url);
  if (og?.name) {
    ok(`Found 1 product via Open Graph: "${og.name}"`);
    return [og];
  }

  fail("No structured data found on this page.");
  return [];
}

// ── Strategy 2: Sitemap discovery ────────────────────────────────────────────

async function findSitemapUrls(baseUrl: string): Promise<string[]> {
  const origin = new URL(baseUrl).origin;
  const candidates = [
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/sitemap-products.xml`,
    `${origin}/sitemap/products.xml`,
  ];

  // Also check robots.txt
  try {
    const res = await fetchWithRetry(`${origin}/robots.txt`);
    const txt = await res.text();
    const matches = txt.match(/^Sitemap:\s*(.+)$/gim) ?? [];
    for (const m of matches) {
      const u = m.replace(/^Sitemap:\s*/i, "").trim();
      if (!candidates.includes(u)) candidates.unshift(u);
    }
  } catch { /* ignore */ }

  return candidates;
}

function isProductUrl(url: string): boolean {
  return /\/(product|mower|lawn|tractor|equipment|item|p\/|dp\/)/i.test(url);
}

async function parseSitemap(url: string): Promise<string[]> {
  try {
    const res = await fetchWithRetry(url);
    const xml = await res.text();

    // Sitemap index — recurse into child sitemaps
    if (xml.includes("<sitemapindex")) {
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
      const childUrls: string[] = [];
      for (const loc of locs.slice(0, 5)) {
        childUrls.push(...await parseSitemap(loc));
      }
      return childUrls;
    }

    // Regular sitemap
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map(m => m[1].trim())
      .filter(isProductUrl);
  } catch {
    return [];
  }
}

async function strategySitemap(baseUrl: string, limit: number): Promise<IngestedProduct[]> {
  log(`\n[Strategy 2] Discovering sitemap from: ${baseUrl}`);
  const sitemapCandidates = await findSitemapUrls(baseUrl);
  let productUrls: string[] = [];

  for (const sm of sitemapCandidates) {
    log(`  Trying: ${sm}`);
    const urls = await parseSitemap(sm);
    if (urls.length > 0) {
      ok(`Found ${urls.length} product URL(s) in ${sm}`);
      productUrls = urls;
      break;
    }
  }

  if (productUrls.length === 0) {
    fail("No product URLs found in any sitemap.");
    return [];
  }

  // Crawl up to `limit` product pages for structured data
  const products: IngestedProduct[] = [];
  const toFetch = productUrls.slice(0, limit);
  log(`  Crawling ${toFetch.length} product pages…`);

  for (const pUrl of toFetch) {
    try {
      const res = await fetchWithRetry(pUrl);
      const html = await res.text();
      const ld = extractJsonLd(html);
      if (ld.length > 0) {
        products.push(...ld.map(p => ({ ...p, sourceUrl: pUrl })));
        process.stdout.write(".");
        continue;
      }
      const og = extractOpenGraph(html, pUrl);
      if (og?.name) { products.push(og); process.stdout.write("."); continue; }
      process.stdout.write("_");
    } catch { process.stdout.write("!"); }
    await sleep(300); // polite crawl delay
  }
  log(""); // newline after dots

  ok(`Extracted ${products.length} product(s) from sitemap crawl`);
  return products;
}

// ── Strategy 3: CSV ──────────────────────────────────────────────────────────

async function strategyCSV(csvPath: string): Promise<IngestedProduct[]> {
  log(`\n[Strategy 3] Parsing CSV: ${csvPath}`);
  const abs = path.resolve(csvPath);
  if (!fs.existsSync(abs)) { fail(`File not found: ${abs}`); return []; }

  const lines: string[] = [];
  const rl = readline.createInterface({ input: fs.createReadStream(abs) });
  for await (const line of rl) lines.push(line);
  rl.close();

  if (lines.length < 2) { fail("CSV is empty or has no data rows."); return []; }

  // Parse header — accept any casing / order
  const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().trim());
  const col = (name: string) => headers.indexOf(name);

  const colName     = col("name")        !== -1 ? col("name")        : col("title");
  const colBrand    = col("brand");
  const colPrice    = col("price");
  const colOriginal = col("original_price") !== -1 ? col("original_price") : col("originalprice");
  const colImage    = col("image")       !== -1 ? col("image")       : col("image_url");
  const colDesc     = col("description") !== -1 ? col("description") : col("desc");
  const colCat      = col("category")    !== -1 ? col("category")    : col("categories");
  const colTags     = col("tags");

  if (colName === -1) { fail("CSV must have a 'name' or 'title' column."); return []; }

  const products: IngestedProduct[] = [];
  for (const line of lines.slice(1)) {
    const cells = parseCSVRow(line);
    const name = cells[colName]?.trim();
    if (!name) continue;

    const price = formatPrice(cells[colPrice] ?? "");
    const original = formatPrice(cells[colOriginal] ?? "") || price;
    products.push({
      name,
      brand: colBrand !== -1 ? cells[colBrand]?.trim() ?? "" : "",
      price,
      originalPrice: original,
      image:         colImage !== -1 ? cells[colImage]?.trim() ?? "" : "",
      description:   colDesc  !== -1 ? cells[colDesc]?.trim() ?? "" : "",
      categories:    colCat   !== -1 ? (cells[colCat] ?? "").split(/[,;|]/).map(c => c.trim()).filter(Boolean) : [],
      tags:          colTags  !== -1 ? (cells[colTags] ?? "").split(/[,;|]/).map(t => t.trim()).filter(Boolean) : [],
    });
  }

  ok(`Parsed ${products.length} product(s) from CSV`);
  return products;
}

function parseCSVRow(line: string): string[] {
  const cells: string[] = [];
  let cur = "", inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (c === "," && !inQuote) {
      cells.push(cur); cur = "";
    } else {
      cur += c;
    }
  }
  cells.push(cur);
  return cells;
}

function formatPrice(raw: string): string {
  const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? raw.trim() : `$${n.toFixed(2)}`;
}

// ── Slug generation ──────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    suffix++;
  }
}

// ── DB upsert ────────────────────────────────────────────────────────────────

async function upsertProduct(p: IngestedProduct): Promise<"created" | "updated" | "skipped"> {
  if (!p.name) return "skipped";

  const slug = await uniqueSlug(p.name);

  // Check if a product with this name already exists
  const existing = await prisma.product.findFirst({ where: { name: p.name } });

  const data = {
    name:          p.name,
    brand:         p.brand || "Unknown",
    slug,
    badge:         "IMPORTED",
    badgeType:     "new",
    rating:        existing?.rating ?? 0,
    reviewCount:   existing?.reviewCount ?? 0,
    price:         p.price || "—",
    originalPrice: p.originalPrice || p.price || "—",
    savings:       "",
    tags:          JSON.stringify(p.tags),
    categories:    JSON.stringify(p.categories),
    description:   p.description,
    image:         p.image,
  };

  if (existing) {
    await prisma.product.update({
      where: { id: existing.id },
      data: {
        brand:       data.brand || existing.brand,
        price:       data.price || existing.price,
        originalPrice: data.originalPrice || existing.originalPrice,
        description: data.description || existing.description,
        image:       data.image || existing.image,
        categories:  p.categories.length ? data.categories : existing.categories,
        tags:        p.tags.length ? data.tags : existing.tags,
      },
    });
    return "updated";
  } else {
    await prisma.product.create({ data });
    return "created";
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  if (!args.url && !args.sitemap && !args.csv) {
    log("Usage:");
    log("  npx tsx scripts/ingest.ts --url   <product-page-url>");
    log("  npx tsx scripts/ingest.ts --sitemap <site-url>");
    log("  npx tsx scripts/ingest.ts --csv   <file.csv>");
    log("\nOptions: --dry-run  --limit N");
    process.exit(1);
  }

  log("═".repeat(60));
  log("  Lawnmowers.com Product Ingestion");
  log("═".repeat(60));

  let products: IngestedProduct[] = [];
  let strategyUsed = "";

  // ── Try strategies ──────────────────────────────────────────────────────

  if (args.url) {
    products = await strategyStructuredData(args.url);
    if (products.length > 0) {
      strategyUsed = "JSON-LD / Open Graph from URL";
    } else {
      log("\n  Falling back to sitemap discovery…");
      products = await strategySitemap(args.url, args.limit);
      if (products.length > 0) strategyUsed = "Sitemap + structured data crawl";
    }
  } else if (args.sitemap) {
    products = await strategySitemap(args.sitemap, args.limit);
    if (products.length > 0) strategyUsed = "Sitemap + structured data crawl";
  } else if (args.csv) {
    products = await strategyCSV(args.csv);
    if (products.length > 0) strategyUsed = "CSV file";
  }

  if (products.length === 0) {
    fail("\nNo products found. Try --csv as a fallback.");
    await prisma.$disconnect();
    process.exit(1);
  }

  log(`\n[Strategy succeeded] ${strategyUsed}`);
  log(`[Found] ${products.length} product(s)`);

  // ── Apply limit ─────────────────────────────────────────────────────────
  const batch = products.slice(0, args.limit);
  if (batch.length < products.length) {
    warn(`Limiting to ${args.limit} products (use --limit N to change)`);
  }

  // ── Dry run preview ─────────────────────────────────────────────────────
  if (args.dryRun) {
    log("\n[Dry Run — not writing to DB]\n");
    for (const p of batch) {
      log(`  • ${p.name}`);
      log(`    brand: ${p.brand || "—"}  price: ${p.price || "—"}`);
      log(`    image: ${p.image ? "✓" : "—"}  desc: ${p.description ? "✓" : "—"}`);
      log(`    categories: ${p.categories.join(", ") || "—"}`);
    }
    await prisma.$disconnect();
    return;
  }

  // ── Upsert ───────────────────────────────────────────────────────────────
  log(`\n[Upserting ${batch.length} product(s) into DB…]\n`);
  let created = 0, updated = 0, skipped = 0;

  for (const p of batch) {
    try {
      const result = await upsertProduct(p);
      if (result === "created") { created++; ok(`Created: ${p.name}`); }
      else if (result === "updated") { updated++; log(`  ~ Updated: ${p.name}`); }
      else { skipped++; warn(`Skipped: ${p.name} (no name)`); }
    } catch (e) {
      fail(`Failed: ${p.name} — ${(e as Error).message}`);
      skipped++;
    }
  }

  log("\n" + "═".repeat(60));
  log(`[Done]  Strategy: ${strategyUsed}`);
  log(`        Created: ${created}  Updated: ${updated}  Skipped: ${skipped}`);
  log("═".repeat(60));

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
