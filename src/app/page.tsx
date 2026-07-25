export const revalidate = 3600;

import { ClientPage } from "@/components/ClientPage";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const [products, categories, reviews, guides, brands, settings] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: "asc" }, include: { affiliateLinks: true } }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
    prisma.review.findMany({ orderBy: { id: "asc" } }),
    prisma.guide.findMany({ orderBy: { id: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.setting.findMany(),
  ]);

  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
  const adsEnabled = settingMap.adsEnabled === "true";
  const adFrequency = parseInt(settingMap.adFrequency ?? "4", 10);
  const hotPickId = settingMap.hotPickProductId ? parseInt(settingMap.hotPickProductId, 10) : null;
  const hotPickProduct = hotPickId
    ? products.find((p) => p.id === hotPickId) ?? products[0] ?? null
    : products[0] ?? null;
  const heroAdEnabled = settingMap.heroAdEnabled === "true";
  const heroAdSlot = settingMap.heroAdSlot ?? "";

  return (
    <ClientPage
      products={products}
      categories={categories}
      reviews={reviews}
      guides={guides}
      brands={brands.map((b) => b.name)}
      adsEnabled={adsEnabled}
      adFrequency={adFrequency}
      hotPickProduct={hotPickProduct}
      heroAdEnabled={heroAdEnabled}
      heroAdSlot={heroAdSlot}
    />
  );
}
