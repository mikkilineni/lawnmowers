# Product Data Ingestion Script

Imports product data into the Lawnmowers.com database from three sources: a single product URL, a site's XML sitemap, or a CSV file. Performs upserts — existing products are updated, new ones are created.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Strategies](#strategies)
- [CLI Flags](#cli-flags)
- [Usage Examples](#usage-examples)
- [CSV Format](#csv-format)
- [Retry Logic](#retry-logic)
- [Database Writes](#database-writes)
- [When to Use Which Strategy](#when-to-use-which-strategy)

---

## Prerequisites

**Environment variable**

```bash
DATABASE_URL=postgresql://user:pass@host/dbname
```

Set it inline with each command or add it to `.env` in the project root — the script loads `.env` automatically via `dotenv`.

**Runtime**

```bash
npm install       # installs tsx and other deps
```

`npx tsx` is used to run the TypeScript script directly without a separate compile step. No global install required.

---

## Strategies

The script supports three ingestion strategies. When you pass `--url`, it tries Strategy 1 first and automatically falls back to Strategy 2 if no structured data is found on that page.

### Strategy 1 — JSON-LD / Open Graph (from a URL)

Fetches a single product page and reads the structured data embedded in the HTML.

- **JSON-LD first**: looks for `<script type="application/ld+json">` blocks with `@type: Product`. Extracts name, brand, price (from `offers`), image, description, and category.
- **Open Graph fallback**: if no JSON-LD product is found, reads `<meta property="og:*">` and `<meta property="product:*">` tags instead.

Best result when a product page has clean structured data markup (most modern e-commerce sites do).

### Strategy 2 — Sitemap discovery

Discovers product URLs from a site's XML sitemap, then crawls each product page and applies Strategy 1 to extract structured data.

Discovery order:
1. Checks `robots.txt` for a `Sitemap:` directive
2. Tries common sitemap paths: `/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-products.xml`, `/sitemap/products.xml`

A URL is treated as a product page if its path contains any of: `product`, `mower`, `lawn`, `tractor`, `equipment`, `item`, `p/`, `dp/`.

Sitemap indexes (files containing `<sitemapindex>`) are recursed into automatically (up to 5 child sitemaps).

### Strategy 3 — CSV

Reads a local CSV file. The simplest and most reliable strategy — use it when automated scraping fails or when you already have product data in a spreadsheet.

Column names are matched case-insensitively. Several common aliases are accepted (see [CSV Format](#csv-format) below).

---

## CLI Flags

| Flag | Value | Description |
|------|-------|-------------|
| `--url` | URL | Fetch a single product page (tries JSON-LD/OG, falls back to sitemap) |
| `--sitemap` | URL | Start sitemap discovery from this base URL |
| `--csv` | path | Read products from a local CSV file |
| `--dry-run` | — | Print what would be written without touching the database |
| `--limit` | integer | Maximum number of products to upsert (default: `50`) |

Exactly one of `--url`, `--sitemap`, or `--csv` is required.

---

## Usage Examples

**Single product page**

```bash
DATABASE_URL=postgresql://... npx tsx scripts/ingest.ts \
  --url https://www.example.com/products/self-propelled-mower-x500
```

**Single product page, preview only**

```bash
DATABASE_URL=postgresql://... npx tsx scripts/ingest.ts \
  --url https://www.example.com/products/self-propelled-mower-x500 \
  --dry-run
```

**Crawl entire site via sitemap, cap at 100 products**

```bash
DATABASE_URL=postgresql://... npx tsx scripts/ingest.ts \
  --sitemap https://www.husqvarna.com \
  --limit 100
```

**Import from a CSV file**

```bash
DATABASE_URL=postgresql://... npx tsx scripts/ingest.ts \
  --csv ./data/husqvarna-products.csv
```

**CSV import, dry-run first to verify output**

```bash
DATABASE_URL=postgresql://... npx tsx scripts/ingest.ts \
  --csv ./data/husqvarna-products.csv \
  --dry-run
```

**CSV import with a row limit**

```bash
DATABASE_URL=postgresql://... npx tsx scripts/ingest.ts \
  --csv ./data/all-products.csv \
  --limit 25
```

**Using a `.env` file instead of an inline variable**

```bash
# .env contains DATABASE_URL=...
npx tsx scripts/ingest.ts --sitemap https://www.toro.com --limit 50
```

---

## CSV Format

### Supported Columns

| Column name(s) | Required | Description |
|----------------|----------|-------------|
| `name` or `title` | **Yes** | Product name. Rows with no value in this column are skipped. |
| `brand` | No | Brand name. Defaults to `"Unknown"` if omitted. |
| `price` | No | Sale/current price. Accepts `$299.99`, `299.99`, or `299`. |
| `original_price` or `originalprice` | No | Pre-sale price. Falls back to `price` if omitted. |
| `image` or `image_url` | No | Absolute URL to the product image. |
| `description` or `desc` | No | Product description text. |
| `category` or `categories` | No | Comma, semicolon, or pipe-separated list of categories. |
| `tags` | No | Comma, semicolon, or pipe-separated list of tags. |

Column names are matched case-insensitively. Column order does not matter.

### Example CSV

```csv
name,brand,price,original_price,image,description,category,tags
Husqvarna 450X Automower,Husqvarna,$2499.99,$2799.99,https://cdn.example.com/450x.jpg,"GPS-guided robotic mower for up to 0.5 acres",Robotic Mowers,robotic;smart;gps
Toro TimeMaster 30,Toro,$999.99,,https://cdn.example.com/timemaster.jpg,"30-inch self-propelled walk-behind mower","Walk-Behind Mowers","self-propelled,wide-cut"
EGO Power+ LM2102SP,EGO,$649.00,$699.00,,,Battery Mowers,cordless;21-inch
```

Notes:
- Wrap values containing commas in double quotes.
- Escape a literal double quote inside a quoted field by doubling it: `""`.
- Price values are normalized to `$NNN.NN` format automatically. Non-numeric price strings are stored as-is.

---

## Retry Logic

All HTTP requests go through `fetchWithRetry`, which retries up to 3 attempts on network errors and on HTTP `429` (rate limited) or `5xx` (server error) responses.

| Attempt | Delay before request |
|---------|----------------------|
| 1 (initial) | none |
| 2 | 2 seconds |
| 3 | 4 seconds |

Each request has a 12-second timeout. If all 3 attempts fail, the URL is skipped and the error is logged.

During sitemap crawls, a 300ms polite delay is added between product page requests regardless of retries.

---

## Database Writes

Each product is upserted into the `Product` table by name (not by URL). Match logic:

- **New product** (no existing row with that name): a full `create` is performed.
- **Existing product** (name already in DB): only non-empty incoming fields overwrite the stored values. Existing `rating`, `reviewCount`, and `slug` are never overwritten.

### Fields written

| DB field | Source | Default if missing |
|----------|--------|--------------------|
| `name` | Ingested name | — (required; row skipped if blank) |
| `brand` | Ingested brand | `"Unknown"` |
| `slug` | Auto-generated from name, deduplicated with numeric suffix if needed | — |
| `price` | Ingested price | `"—"` |
| `originalPrice` | Ingested original price, falls back to `price` | `"—"` |
| `description` | Ingested description | `""` |
| `image` | Ingested image URL | `""` |
| `categories` | Ingested categories, JSON-stringified | `"[]"` |
| `tags` | Ingested tags, JSON-stringified | `"[]"` |
| `badge` | Fixed value | `"IMPORTED"` |
| `badgeType` | Fixed value | `"new"` |
| `savings` | Fixed value | `""` |
| `rating` | Preserved from existing row | `0` for new products |
| `reviewCount` | Preserved from existing row | `0` for new products |

On update, blank/empty incoming values do not overwrite populated existing values. For example, if a re-ingested product has no image URL, the existing image is kept.

---

## When to Use Which Strategy

| Scenario | Recommended strategy |
|----------|----------------------|
| You have a direct link to one product page | `--url` |
| You want to bulk-import from a retailer's site | `--sitemap <base-url>` |
| The site has no sitemap or blocks crawlers | `--csv` |
| You already have product data in a spreadsheet | `--csv` |
| You want to refresh prices/descriptions for existing products | `--sitemap` or `--url` |
| You're doing a first test / sanity check | Any strategy with `--dry-run` |
| A `--url` crawl returned 0 products | Try `--sitemap` explicitly, then fall back to `--csv` |
