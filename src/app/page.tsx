export const dynamic = "force-dynamic";

import { ClientPage } from "@/components/ClientPage";
import { seedIfEmpty } from "@/lib/seed";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  await seedIfEmpty();

  const [products, categories, reviews, guides, brands, adsSetting, freqSetting, hotPickSetting] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: "asc" }, include: { affiliateLinks: true } }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
    prisma.review.findMany({ orderBy: { id: "asc" } }),
    prisma.guide.findMany({ orderBy: { id: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.setting.findUnique({ where: { key: "adsEnabled" } }),
    prisma.setting.findUnique({ where: { key: "adFrequency" } }),
    prisma.setting.findUnique({ where: { key: "hotPickProductId" } }),
  ]);
  const adsEnabled = adsSetting?.value === "true";
  const adFrequency = parseInt(freqSetting?.value ?? "4", 10);
  const hotPickId = hotPickSetting?.value ? parseInt(hotPickSetting.value, 10) : null;
  const hotPickProduct = hotPickId
    ? products.find((p) => p.id === hotPickId) ?? products[0] ?? null
    : products[0] ?? null;

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
      adsEnabled={adsEnabled}
      adFrequency={adFrequency}
      hotPickProduct={hotPickProduct}
    />
  );
}
