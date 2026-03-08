export const dynamic = "force-dynamic";

import { ClientPage } from "@/components/ClientPage";
import { seedIfEmpty } from "@/lib/seed";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  await seedIfEmpty();

  const [products, categories, reviews, guides, brands] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: "asc" }, include: { affiliateLinks: true } }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
    prisma.review.findMany({ orderBy: { id: "asc" } }),
    prisma.guide.findMany({ orderBy: { id: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <ClientPage
      products={products.map((p) => ({
        ...p,
        tags: JSON.parse(p.tags) as string[],
        categories: JSON.parse(p.categories) as string[],
      }))}
      categories={categories}
      reviews={reviews}
      guides={guides}
      brands={brands.map((b) => b.name)}
    />
  );
}
