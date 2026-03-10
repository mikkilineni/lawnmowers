import { parse } from "node-html-parser";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);
const DIR = "C:/Data/lawnmowers-robotic-reviews-seo/review_pages";

function t(el) { return el?.text?.trim() ?? ""; }

function parseFile(filepath) {
  const html = readFileSync(filepath, "utf8");
  const root = parse(html);

  const brand = t(root.querySelector(".review-brand"));
  const fullTitle = t(root.querySelector(".review-title")).replace(/ Review$/, "");
  const name = fullTitle.startsWith(brand) ? fullTitle.slice(brand.length).trim() : fullTitle;
  const tagline = t(root.querySelector(".review-tagline"));

  const rating = parseFloat(t(root.querySelector(".rating-score"))) || 4.0;

  const quickSpecs = {};
  root.querySelectorAll(".quick-spec").forEach(el => {
    const label = t(el.querySelector(".quick-spec-label")).toLowerCase();
    const value = t(el.querySelector(".quick-spec-value"));
    if (label && value) quickSpecs[label] = value;
  });

  const badges = root.querySelectorAll(".badge").map(b => t(b)).filter(Boolean);

  const verdictBox = root.querySelector(".verdict-box");
  const verdictLabel = t(verdictBox?.querySelector(".verdict-label"));
  const verdict = (verdictBox?.querySelectorAll("p") ?? []).map(p => t(p)).join("\n\n");

  const pros = (root.querySelector(".pros-box ul")?.querySelectorAll("li") ?? []).map(li => t(li));
  const cons = (root.querySelector(".cons-box ul")?.querySelectorAll("li") ?? []).map(li => t(li));

  const specsTable = [];
  root.querySelectorAll(".specs-table tr").forEach(row => {
    const label = t(row.querySelector(".spec-label"));
    const value = t(row.querySelector(".spec-value"));
    if (label && value) specsTable.push({ label, value });
  });

  const h2s = root.querySelectorAll(".review-body h2");
  const keyFeaturesH = h2s.find(h => t(h).includes("Key Features"));
  const keyFeatures = keyFeaturesH ? t(keyFeaturesH.nextElementSibling) : "";
  const whoH = h2s.find(h => t(h).includes("Who Should"));
  const whoShouldBuy = whoH ? t(whoH.nextElementSibling) : "";

  const faq = root.querySelectorAll(".faq-item").map(item => ({
    q: t(item.querySelector("summary")),
    a: t(item.querySelector("p")),
  })).filter(f => f.q && f.a);

  const keySpecs = {};
  root.querySelectorAll(".key-spec-row").forEach(row => {
    const label = t(row.querySelector(".key-spec-label"));
    const value = t(row.querySelector(".key-spec-val"));
    if (label && value) keySpecs[label] = value;
  });

  const bestForCard = root.querySelectorAll(".sidebar-card")
    .find(c => t(c.querySelector("h3")).includes("Best For"));
  const bestFor = t(bestForCard?.querySelector("p"));

  const affiliateLinks = root.querySelectorAll(".price-row").map(row => ({
    retailer: t(row.querySelector(".price-retailer")),
    price: t(row.querySelector(".price-amount")),
    url: "#",
  })).filter(l => l.retailer && l.price);

  const navigation = specsTable.find(s => s.label === "Navigation")?.value ?? "";
  const wireFree = specsTable.find(s => s.label === "Wire-Free")?.value ?? "No";
  const slug = filepath.split(/[\\/]/).pop().replace(".html", "");

  return {
    slug,
    brand,
    name,
    badge: badges[0] ?? "🤖 Robotic",
    badgeType: "popular",
    emoji: "🤖",
    rating,
    reviewCount: 12,
    price: quickSpecs["price"] ?? "",
    originalPrice: quickSpecs["price"] ?? "",
    savings: "",
    tags: JSON.stringify(["robotic", "autonomous"]),
    categories: JSON.stringify(["robot"]),
    description: tagline,
    image: "",
    pros: pros.join("\n"),
    cons: cons.join("\n"),
    review: verdict,
    extrasJson: JSON.stringify({
      tagline, verdictLabel, quickSpecs, badges,
      specsTable, keyFeatures, whoShouldBuy,
      faq, keySpecs, bestFor, navigation, wireFree,
    }),
    affiliateLinks,
  };
}

async function main() {
  const files = readdirSync(DIR)
    .filter(f => f.endsWith(".html") && f !== "index.html");

  console.log(`Found ${files.length} HTML files\n`);
  let added = 0, updated = 0, errors = 0;

  for (const file of files) {
    try {
      const d = parseFile(join(DIR, file));
      if (!d.brand || !d.name) { console.warn(`  ⚠ Skipping ${file}`); continue; }

      // Check existing
      const rows = await sql`SELECT id FROM "Product" WHERE slug = ${d.slug}`;
      const existing = rows[0];

      if (existing) {
        await sql`
          UPDATE "Product" SET
            brand=${d.brand}, name=${d.name}, badge=${d.badge}, "badgeType"=${d.badgeType},
            emoji=${d.emoji}, rating=${d.rating}, "reviewCount"=${d.reviewCount},
            price=${d.price}, "originalPrice"=${d.originalPrice}, savings=${d.savings},
            tags=${d.tags}, categories=${d.categories}, description=${d.description},
            image=${d.image}, pros=${d.pros}, cons=${d.cons}, review=${d.review},
            "extrasJson"=${d.extrasJson}
          WHERE slug=${d.slug}
        `;
        await sql`DELETE FROM "AffiliateLink" WHERE "productId"=${existing.id}`;
        for (const link of d.affiliateLinks) {
          await sql`INSERT INTO "AffiliateLink" ("productId", retailer, url, price) VALUES (${existing.id}, ${link.retailer}, ${link.url}, ${link.price})`;
        }
        console.log(`  ↻ Updated: ${d.brand} ${d.name}`);
        updated++;
      } else {
        const [created] = await sql`
          INSERT INTO "Product" (slug, brand, name, badge, "badgeType", emoji, rating, "reviewCount",
            price, "originalPrice", savings, tags, categories, description, image, pros, cons, review, "extrasJson")
          VALUES (${d.slug}, ${d.brand}, ${d.name}, ${d.badge}, ${d.badgeType}, ${d.emoji}, ${d.rating},
            ${d.reviewCount}, ${d.price}, ${d.originalPrice}, ${d.savings}, ${d.tags}, ${d.categories},
            ${d.description}, ${d.image}, ${d.pros}, ${d.cons}, ${d.review}, ${d.extrasJson})
          RETURNING id
        `;
        for (const link of d.affiliateLinks) {
          await sql`INSERT INTO "AffiliateLink" ("productId", retailer, url, price) VALUES (${created.id}, ${link.retailer}, ${link.url}, ${link.price})`;
        }
        console.log(`  ✓ Added:   ${d.brand} ${d.name}`);
        added++;
      }
    } catch (err) {
      console.error(`  ✗ Error in ${file}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone — ${added} added, ${updated} updated, ${errors} errors`);
}

main();
