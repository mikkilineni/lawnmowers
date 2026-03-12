import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ReviewBuyButtons } from "@/components/ReviewBuyButtons";
import { InArticleAd } from "@/components/InArticleAd";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Review Not Found" };
  return {
    title: `${product.brand} ${product.name} Review — Lawnmowers.com`,
    description: product.description || `Expert review of the ${product.brand} ${product.name}. Read pros, cons, pricing and where to buy.`,
    openGraph: {
      title: `${product.brand} ${product.name} Review`,
      description: product.description || `Expert review of the ${product.brand} ${product.name}.`,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { affiliateLinks: true },
  });

  if (!product) notFound();

  const tags: string[] = JSON.parse(product.tags);
  const categories: string[] = JSON.parse(product.categories);
  const pros: string[] = product.pros ? product.pros.split("\n").filter(Boolean) : [];
  const cons: string[] = product.cons ? product.cons.split("\n").filter(Boolean) : [];

  const allProducts = await prisma.product.findMany({
    where: { id: { not: product.id } },
  });

  const related = allProducts
    .filter(p => {
      const pCats: string[] = JSON.parse(p.categories);
      const pTags: string[] = JSON.parse(p.tags);
      return pCats.some(c => categories.includes(c)) || pTags.some(t => tags.includes(t));
    })
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      badge: p.badge,
      badgeType: p.badgeType,
      brand: p.brand,
      name: p.name,
      emoji: p.emoji,
      price: p.price,
      image: p.image,
    }));

  const badgeColors: Record<string, { bg: string; color: string }> = {
    best:    { bg: "rgba(168,216,50,0.15)", color: "#5a9e2f" },
    popular: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },
    new:     { bg: "rgba(56,189,248,0.12)", color: "#0ea5e9" },
    sale:    { bg: "rgba(251,191,36,0.15)", color: "#d97706" },
  };
  const badge = badgeColors[product.badgeType] ?? badgeColors.best;

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
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/#products" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem" }}>Top Picks</Link>
          <Link href="/#categories" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem" }}>Types</Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ padding: "1rem 7%", fontSize: "0.8rem", color: "var(--muted, #8b8680)" }}>
        <Link href="/" style={{ color: "var(--green, #1a6b2a)", textDecoration: "none" }}>Home</Link>
        {" / "}
        <Link href="/#products" style={{ color: "var(--green, #1a6b2a)", textDecoration: "none" }}>Reviews</Link>
        {" / "}
        <span>{product.brand} {product.name}</span>
      </div>

      <main style={{ padding: "0 7% 5rem" }}>

        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start", marginBottom: "3rem" }} className="review-hero">

          {/* Image */}
          <div style={{
            background: "linear-gradient(135deg, #1a6b2a 0%, #5a9e2f 100%)",
            borderRadius: 16, height: 340,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "8rem", position: "relative", overflow: "hidden",
          }}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span>{product.emoji}</span>
            )}
            <div style={{
              position: "absolute", top: 16, left: 16,
              background: badge.bg, color: badge.color,
              padding: "5px 12px", borderRadius: 6,
              fontSize: "0.78rem", fontWeight: 700, backdropFilter: "blur(8px)",
            }}>
              {product.badge}
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ color: "var(--muted, #8b8680)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 6 }}>
              {product.brand}
            </div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              color: "var(--dark, #1c2e0e)", letterSpacing: "0.02em",
              marginBottom: "0.75rem", lineHeight: 1.1,
            }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <span style={{ color: "#fbbf24", fontSize: "1.2rem" }}>
                {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
              </span>
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>{product.rating}</span>
              <span style={{ color: "var(--muted, #8b8680)", fontSize: "0.85rem" }}>({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "var(--dark, #1c2e0e)" }}>{product.price}</span>
              {product.originalPrice && (
                <span style={{ color: "var(--muted, #8b8680)", textDecoration: "line-through", marginLeft: 10, fontSize: "1rem" }}>{product.originalPrice}</span>
              )}
              {product.savings && (
                <div style={{ color: "#1a6b2a", fontWeight: 600, fontSize: "0.82rem", marginTop: 2 }}>{product.savings}</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  background: "white", border: "1px solid #e5e1db",
                  padding: "4px 12px", borderRadius: 20,
                  fontSize: "0.78rem", color: "var(--muted, #8b8680)", fontWeight: 500,
                }}>{tag}</span>
              ))}
            </div>

            <ReviewBuyButtons links={product.affiliateLinks} />
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>Overview</h2>
            <p style={{ color: "var(--muted, #8b8680)", lineHeight: 1.8, fontSize: "0.95rem" }}>{product.description}</p>
          </section>
        )}

        <InArticleAd />

        {/* Full Review */}
        {product.review && (
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>Full Review</h2>
            {product.review.split("\n\n").map((para, i) => (
              <p key={i} style={{ color: "var(--muted, #8b8680)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1rem" }}>{para}</p>
            ))}
          </section>
        )}

        <InArticleAd />

        {/* Pros & Cons */}
        {(pros.length > 0 || cons.length > 0) && (
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>Pros & Cons</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="pros-cons-grid">
              {pros.length > 0 && (
                <div style={{ background: "rgba(90,158,47,0.06)", border: "1px solid rgba(90,158,47,0.2)", borderRadius: 12, padding: "1.25rem" }}>
                  <div style={{ fontWeight: 700, color: "#1a6b2a", marginBottom: "0.75rem", fontSize: "0.9rem" }}>✅ Pros</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {pros.map((pro, i) => (
                      <li key={i} style={{ color: "var(--dark, #1c2e0e)", fontSize: "0.88rem", display: "flex", gap: 8 }}>
                        <span style={{ color: "#1a6b2a", flexShrink: 0 }}>+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cons.length > 0 && (
                <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "1.25rem" }}>
                  <div style={{ fontWeight: 700, color: "#ef4444", marginBottom: "0.75rem", fontSize: "0.9rem" }}>❌ Cons</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {cons.map((con, i) => (
                      <li key={i} style={{ color: "var(--dark, #1c2e0e)", fontSize: "0.88rem", display: "flex", gap: 8 }}>
                        <span style={{ color: "#ef4444", flexShrink: 0 }}>−</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        <RelatedProducts products={related} />

      </main>

      <style>{`
        @media (max-width: 768px) {
          .review-hero { grid-template-columns: 1fr !important; }
          .pros-cons-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 16,
  padding: "2rem",
  marginBottom: "1.5rem",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "1.6rem",
  color: "var(--dark, #1c2e0e)",
  letterSpacing: "0.02em",
  marginBottom: "1rem",
};
