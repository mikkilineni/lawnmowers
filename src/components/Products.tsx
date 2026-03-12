"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type BadgeType = "best" | "popular" | "new" | "sale";

export interface AffiliateLink {
  id: number;
  retailer: string;
  url: string;
  price: string;
}

export interface ProductRow {
  id: number;
  slug: string;
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
  affiliateLinks?: AffiliateLink[];
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

function BuyButton({ links }: { links: AffiliateLink[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (links.length === 0) {
    return (
      <button disabled style={{
        background: "#e5e7eb", color: "#9ca3af", border: "none",
        padding: "10px 20px", borderRadius: 8, fontWeight: 600,
        fontSize: "0.85rem", cursor: "not-allowed",
      }}>
        Buy Now
      </button>
    );
  }

  if (links.length === 1) {
    return (
      <a href={links[0].url} target="_blank" rel="sponsored noopener noreferrer" style={{
        background: "var(--green)", color: "var(--white)", border: "none",
        padding: "10px 20px", borderRadius: 8, fontWeight: 600,
        fontSize: "0.85rem", cursor: "pointer", textDecoration: "none",
        display: "inline-block", transition: "background 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--green-mid)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--green)")}
      >
        Buy at {links[0].retailer}
      </a>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: "var(--green)", color: "var(--white)", border: "none",
        padding: "10px 20px", borderRadius: 8, fontWeight: 600,
        fontSize: "0.85rem", cursor: "pointer", transition: "background 0.2s",
        display: "flex", alignItems: "center", gap: 6,
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--green-mid)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--green)")}
      >
        Buy Now
        <span style={{ fontSize: "0.65rem", opacity: 0.85 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", right: 0,
          background: "white", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          overflow: "hidden", minWidth: 200, zIndex: 50,
          border: "1px solid rgba(0,0,0,0.06)",
        }}>
          <div style={{ padding: "8px 14px 6px", fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid #f0ede8" }}>
            Compare Prices
          </div>
          {links.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="sponsored noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", textDecoration: "none", color: "var(--dark)",
                fontSize: "0.85rem", fontWeight: 500, transition: "background 0.15s",
                gap: 12,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span>{link.retailer}</span>
              {link.price && (
                <span style={{ color: "var(--green)", fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}>
                  {link.price}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductsProps {
  products: ProductRow[];
  activeBrand?: string | null;
  activeCategory?: string | null;
  onClearFilter?: () => void;
  adsEnabled?: boolean;
  adFrequency?: number;
}

function AdCard() {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch { /* already initialized */ }
  }, []);

  return (
    <div style={{
      background: "var(--white)", borderRadius: 12, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      minHeight: 280,
    }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-9865114779201806"
        data-ad-slot="8957005333"
      />
    </div>
  );
}

export function Products({ products, activeBrand, activeCategory, onClearFilter, adsEnabled, adFrequency = 4 }: ProductsProps) {
  const [active, setActive] = useState("all");

  const externalFilter = activeBrand ?? activeCategory ?? null;

  const visible = (() => {
    if (activeBrand) return products.filter(p => p.brand === activeBrand);
    if (activeCategory) return products.filter(p => p.categories.includes(activeCategory));
    return active === "all" ? products : products.filter(p => p.categories.includes(active));
  })();

  return (
    <section id="products" className="section-pad" style={{ background: "var(--cream)", padding: "5rem 7%" }}>
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

      {/* Active filter chip */}
      {externalFilter && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Showing results for:</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--green)", color: "white",
            padding: "5px 12px", borderRadius: 20, fontSize: "0.82rem", fontWeight: 600,
          }}>
            {activeBrand ?? activeCategory}
            <button onClick={onClearFilter} style={{
              background: "none", border: "none", color: "white",
              cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: 0, opacity: 0.8,
            }}>×</button>
          </span>
          {visible.length === 0 && (
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>— no products found</span>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar" style={{
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
        <div className="filter-scroll" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
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
        <select className="filter-sort" style={{
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
        {visible.flatMap((p, i) => {
          const showAd = adsEnabled && i > 0 && (i + 1) % adFrequency === 0;
          const items = [];
          if (showAd) items.push(<AdCard key={`ad-${i}`} />);
          items.push(renderCard(p));
          return items;
        })}
      </div>
    </section>
  );
}

function renderCard(p: ProductRow) {
          const badge = BADGE_COLORS[p.badgeType];
          const links = p.affiliateLinks ?? [];
          return (
            <div key={p.id} className={p.badgeType ? `card-${p.badgeType}` : ""} style={{
              background: "var(--white)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
            >
              {/* Image area */}
              <div style={{
                background: "linear-gradient(145deg, #122b13 0%, var(--green) 50%, #2a6b1a 100%)",
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "5rem",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Subtle grid pattern overlay */}
                <div aria-hidden="true" style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 32px)",
                }} />
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
                  <BuyButton links={links} />
                </div>
                {p.slug && (
                  <Link href={`/reviews/${p.slug}`} style={{
                    display: "block", textAlign: "center",
                    marginTop: "0.75rem",
                    color: "var(--green)", fontSize: "0.82rem", fontWeight: 600,
                    textDecoration: "none",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                  >
                    Read Full Review →
                  </Link>
                )}
              </div>
            </div>
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
