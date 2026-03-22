import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { CompareTable } from "@/components/CompareTable";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ ids?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { ids } = await searchParams;
  const count = (ids ?? "").split(",").filter(Boolean).length;
  return {
    title: `Compare ${count} Mowers — Lawnmowers.com`,
    description: "Side-by-side mower comparison: price, rating, pros, cons, and where to buy.",
  };
}

export default async function ComparePage({ searchParams }: Props) {
  const { ids } = await searchParams;
  const idList = (ids ?? "")
    .split(",")
    .map(Number)
    .filter(n => !isNaN(n) && n > 0)
    .slice(0, 4);

  if (idList.length < 2) notFound();

  const raw = await prisma.product.findMany({
    where: { id: { in: idList } },
    include: { affiliateLinks: true },
  });

  // Preserve URL ID order and ensure stable columns
  const products = idList
    .map(id => raw.find(p => p.id === id))
    .filter(Boolean)
    .map(p => ({
      id: p!.id,
      slug: p!.slug,
      brand: p!.brand,
      name: p!.name,
      emoji: p!.emoji,
      image: p!.image,
      badge: p!.badge,
      badgeType: p!.badgeType,
      rating: p!.rating,
      reviewCount: p!.reviewCount,
      price: p!.price,
      originalPrice: p!.originalPrice,
      savings: p!.savings,
      tags: p!.tags,
      categories: p!.categories,
      pros: p!.pros,
      cons: p!.cons,
      description: p!.description,
      specsJson: p!.specsJson,
      affiliateLinks: p!.affiliateLinks,
    }));

  if (products.length < 2) notFound();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--cream, #f8f5f0)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(14,26,15,0.97)", backdropFilter: "blur(12px)",
        padding: "0 7%", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(168,216,50,0.12)",
      }}>
        <Link href="/" style={{ textDecoration: "none", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#a8d832", letterSpacing: 2 }}>
          Lawnmowers.com
        </Link>
        <Link href="/#products" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem" }}>
          ← Back to Products
        </Link>
      </nav>

      <main style={{ padding: "2rem 7% 6rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Side-by-Side
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)", letterSpacing: "0.02em", margin: 0 }}>
            Mower Comparison
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "0.5rem" }}>
            Comparing {products.length} mowers · <Link href="/#products" style={{ color: "var(--green)" }}>Add more</Link>
          </p>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <CompareTable products={products} />
        </div>
      </main>
    </div>
  );
}
