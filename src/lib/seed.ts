import prisma from "./prisma";
import { PRODUCTS, CATEGORIES, REVIEWS, GUIDES, BRANDS } from "@/data/products";

export async function seedIfEmpty() {
  const count = await prisma.product.count();
  if (count > 0) return;

  await prisma.product.createMany({
    data: PRODUCTS.map((p) => ({
      badge: p.badge,
      badgeType: p.badgeType,
      brand: p.brand,
      name: p.name,
      emoji: p.emoji,
      rating: p.rating,
      reviewCount: p.reviews,
      price: p.price,
      originalPrice: p.originalPrice,
      savings: p.savings,
      tags: JSON.stringify(p.tags),
      categories: JSON.stringify(p.categories),
    })),
  });

  await prisma.category.createMany({ data: CATEGORIES });
  await prisma.review.createMany({ data: REVIEWS });
  await prisma.guide.createMany({ data: GUIDES });
  await prisma.brand.createMany({
    data: BRANDS.map((name) => ({ name })),
  });
}
