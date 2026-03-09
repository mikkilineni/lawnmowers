import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function toSlug(brand: string, name: string) {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface AffiliateInput {
  retailer: string;
  url: string;
  price: string;
}

interface ProductInput {
  brand: string;
  name: string;
  badge: string;
  badgeType: string;
  emoji: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice: string;
  savings: string;
  categories: string[];
  tags: string[];
  description: string;
  image: string;
  pros: string;
  cons: string;
  review: string;
  affiliateLinks: AffiliateInput[];
}

export async function POST(request: Request) {
  const rows: ProductInput[] = await request.json();

  let added = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const row of rows) {
    try {
      const slug = toSlug(row.brand, row.name);

      const data = {
        slug,
        brand: row.brand,
        name: row.name,
        badge: row.badge || "⭐ Featured",
        badgeType: row.badgeType || "best",
        emoji: row.emoji || "🌿",
        rating: row.rating || 4.5,
        reviewCount: row.reviewCount || 0,
        price: row.price,
        originalPrice: row.originalPrice || row.price,
        savings: row.savings || "",
        categories: JSON.stringify(row.categories),
        tags: JSON.stringify(row.tags),
        description: row.description || "",
        image: row.image || "",
        pros: row.pros || "",
        cons: row.cons || "",
        review: row.review || "",
      };

      const existing = await prisma.product.findUnique({ where: { slug } });

      if (existing) {
        await prisma.product.update({ where: { slug }, data });
        // Replace affiliate links
        await prisma.affiliateLink.deleteMany({ where: { productId: existing.id } });
        for (const link of row.affiliateLinks) {
          if (link.retailer && link.url) {
            await prisma.affiliateLink.create({
              data: { productId: existing.id, retailer: link.retailer, url: link.url, price: link.price || "" },
            });
          }
        }
        updated++;
      } else {
        const created = await prisma.product.create({ data });
        for (const link of row.affiliateLinks) {
          if (link.retailer && link.url) {
            await prisma.affiliateLink.create({
              data: { productId: created.id, retailer: link.retailer, url: link.url, price: link.price || "" },
            });
          }
        }
        added++;
      }
    } catch (err) {
      errors.push(`${row.brand} ${row.name}: ${(err as Error).message}`);
    }
  }

  return NextResponse.json({ added, updated, errors });
}
