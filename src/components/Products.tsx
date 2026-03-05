"use client";

import { useState } from "react";

type BadgeType = "best" | "popular" | "new" | "sale";

export interface ProductRow {
  id: number;
  badge: string;
  badgeType: string;
  brand: string;
  name: string;
  emoji: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice: string;
  savings: string;
  tags: string[];
  categories: string[];
  description?: string;
  image?: string;
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "⚡ Electric", value: "electric" },
  { label: "⛽ Gas", value: "gas" },
  { label: "🤖 Robot", value: "robot" },
  { label: "🛺 Riding", value: "riding" },
  { label: "💰 Under $500", value: "under500" },
];

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  best:    { bg: "rgba(168,216,50,0.15)", color: "var(--green)" },
  popular: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },
  new:     { bg: "rgba(56,189,248,0.12)", color: "#0ea5e9" },
  sale:    { bg: "rgba(251,191,36,0.15)", color: "#d97706" },
};

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#fbbf24" }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

export function Products({ products }: { products: ProductRow[] }) {
  const [active, setActive] = useState("all");

  const visible = active === "all"
    ? products
    : products.filter(p => p.categories.includes(active));

  return (
    <section id="products" style={{ background: "var(--cream)", padding: "5rem 7%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={labelStyle}>Top Picks</div>
          <h2 style={titleStyle}>Our Best Mower Reviews</h2>
        </div>
        <a href="#" style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
          View All 200+ Reviews →
        </a>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: "var(--white)",
        borderRadius: 12,
        padding: "1rem 1.5rem",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600, marginRight: 4 }}>Filter:</span>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setActive(f.value)} style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
              background: active === f.value ? "var(--green)" : "var(--cream)",
              color: active === f.value ? "var(--white)" : "var(--dark)",
            }}>
              {f.label}
            </button>
          ))}
        </div>
        <select style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "7px 12px",
          fontSize: "0.85rem",
          background: "var(--white)",
          color: "var(--dark)",
          cursor: "pointer",
          outline: "none",
        }}>
          <option>Best Rated</option>
          <option>Price Low to High</option>
          <option>Price High to Low</option>
          <option>Most Popular</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.5rem",
      }}>
        {visible.map(p => {
          const badge = BADGE_COLORS[p.badgeType];
          return (
            <div key={p.id} style={{
              background: "var(--white)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
            >
              {/* Image area */}
              <div style={{
                background: "linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%)",
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "5rem",
                position: "relative",
                overflow: "hidden",
              }}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                    }}
                  />
                ) : null}
                <div style={{
                  display: p.image ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  position: p.image ? "absolute" : "relative",
                  inset: 0,
                }}>
                  {p.emoji}
                </div>
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: badge.bg,
                  color: badge.color,
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  backdropFilter: "blur(8px)",
                  backgroundColor: badge.bg,
                }}>
                  {p.badge}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "1.25rem" }}>
                <div style={{ color: "var(--muted)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>{p.brand}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--dark)", marginBottom: "0.5rem", lineHeight: 1.3 }}>{p.name}</div>

                {p.description && (
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem", lineHeight: 1.6, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.description}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
                  <Stars rating={p.rating} />
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{p.rating} ({p.reviewCount.toLocaleString()})</span>
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem" }}>
                  {p.tags.map(tag => (
                    <span key={tag} style={{
                      background: "var(--cream)",
                      color: "var(--muted)",
                      padding: "3px 10px",
                      borderRadius: 4,
                      fontSize: "0.72rem",
                      fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>

                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f0ede8",
                }}>
                  <div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "var(--dark)" }}>{p.price}</span>
                    <span style={{ color: "var(--muted)", textDecoration: "line-through", marginLeft: 6, fontSize: "0.85rem" }}>{p.originalPrice}</span>
                    <div style={{ color: "var(--green)", fontSize: "0.72rem", fontWeight: 600 }}>{p.savings}</div>
                  </div>
                  <button style={{
                    background: "var(--green)",
                    color: "var(--white)",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--green-mid)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "var(--green)")}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const labelStyle: React.CSSProperties = {
  color: "var(--green)",
  fontWeight: 600,
  fontSize: "0.78rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  marginBottom: "0.5rem",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "clamp(2rem, 4vw, 3rem)",
  color: "var(--dark)",
  letterSpacing: "0.02em",
};
