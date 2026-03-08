"use client";

import Link from "next/link";

interface RelatedProduct {
  id: number;
  slug: string;
  badge: string;
  badgeType: string;
  brand: string;
  name: string;
  emoji: string;
  price: string;
  image: string;
}

const badgeColors: Record<string, { bg: string; color: string }> = {
  best:    { bg: "rgba(168,216,50,0.15)", color: "#5a9e2f" },
  popular: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },
  new:     { bg: "rgba(56,189,248,0.12)", color: "#0ea5e9" },
  sale:    { bg: "rgba(251,191,36,0.15)", color: "#d97706" },
};

export function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section style={{
      background: "white", borderRadius: 16, padding: "2rem",
      marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem",
        color: "var(--dark, #1c2e0e)", letterSpacing: "0.02em", marginBottom: "1rem",
      }}>
        Related Products
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
        {products.map(p => {
          const relBadge = badgeColors[p.badgeType] ?? badgeColors.best;
          return (
            <Link key={p.id} href={`/reviews/${p.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "white", borderRadius: 12, overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 28px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{
                  background: "linear-gradient(135deg, #1a6b2a 0%, #5a9e2f 100%)",
                  height: 140, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "4rem", position: "relative",
                }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span>{p.emoji}</span>
                  )}
                  <div style={{
                    position: "absolute", top: 10, left: 10,
                    background: relBadge.bg, color: relBadge.color,
                    padding: "3px 8px", borderRadius: 5, fontSize: "0.68rem", fontWeight: 700,
                  }}>
                    {p.badge}
                  </div>
                </div>
                <div style={{ padding: "1rem" }}>
                  <div style={{ color: "var(--muted, #8b8680)", fontSize: "0.72rem", fontWeight: 600, marginBottom: 3 }}>{p.brand}</div>
                  <div style={{ fontWeight: 600, color: "var(--dark, #1c2e0e)", fontSize: "0.9rem", marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--dark, #1c2e0e)" }}>{p.price}</span>
                    <span style={{ color: "#1a6b2a", fontSize: "0.78rem", fontWeight: 600 }}>Read Review →</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
