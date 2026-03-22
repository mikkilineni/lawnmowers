"use client";

import Link from "next/link";

interface AffiliateLink { id: number; retailer: string; url: string; price: string; }

interface CompareProduct {
  id: number;
  slug: string;
  brand: string;
  name: string;
  emoji: string;
  image: string;
  badge: string;
  badgeType: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice: string;
  savings: string;
  tags: string[];
  categories: string[];
  pros: string[];
  cons: string[];
  description: string;
  affiliateLinks: AffiliateLink[];
}

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  best:    { bg: "rgba(168,216,50,0.15)", color: "var(--green)" },
  popular: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },
  new:     { bg: "rgba(56,189,248,0.12)", color: "#0ea5e9" },
  sale:    { bg: "rgba(251,191,36,0.15)", color: "#d97706" },
};

function copyUrl() {
  navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"));
}

export function CompareTable({ products }: { products: CompareProduct[] }) {
  const n = products.length;

  return (
    <div style={{ overflowX: "auto" }}>
      {/* Share button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button onClick={copyUrl} style={{
          background: "white", border: "1px solid #ddd", borderRadius: 8,
          padding: "8px 18px", fontSize: "0.82rem", fontWeight: 600,
          cursor: "pointer", color: "var(--green)", display: "flex", alignItems: "center", gap: 6,
        }}>
          🔗 Copy comparison link
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: n * 260 }}>
        <tbody>

          {/* ── Product header row ── */}
          <tr>
            <td style={labelCell}>Product</td>
            {products.map(p => {
              const badge = BADGE_COLORS[p.badgeType] ?? BADGE_COLORS.best;
              return (
                <td key={p.id} style={{ ...dataCell, verticalAlign: "top", textAlign: "center", padding: "1.25rem" }}>
                  <div style={{
                    background: "linear-gradient(145deg, #122b13 0%, var(--green) 100%)",
                    borderRadius: 10, height: 160, display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden", marginBottom: "0.75rem",
                  }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "4rem" }}>{p.emoji}</span>
                    )}
                    <span style={{
                      position: "absolute", top: 8, left: 8,
                      background: badge.bg, color: badge.color,
                      padding: "3px 8px", borderRadius: 5, fontSize: "0.68rem", fontWeight: 700,
                    }}>{p.badge}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 2 }}>{p.brand}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.97rem", color: "var(--dark)", lineHeight: 1.3 }}>{p.name}</div>
                  {p.slug && (
                    <Link href={`/reviews/${p.slug}`} style={{ fontSize: "0.75rem", color: "var(--green)", display: "block", marginTop: 6 }}>
                      Full Review →
                    </Link>
                  )}
                </td>
              );
            })}
          </tr>

          {/* ── Rating ── */}
          <tr style={{ background: "var(--cream)" }}>
            <td style={labelCell}>Rating</td>
            {products.map(p => (
              <td key={p.id} style={{ ...dataCell, textAlign: "center" }}>
                <div style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                  {"★".repeat(Math.round(p.rating))}{"☆".repeat(5 - Math.round(p.rating))}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
                  {p.rating} · {p.reviewCount.toLocaleString()} reviews
                </div>
              </td>
            ))}
          </tr>

          {/* ── Price ── */}
          <tr>
            <td style={labelCell}>Price</td>
            {products.map(p => (
              <td key={p.id} style={{ ...dataCell, textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "var(--dark)" }}>{p.price}</div>
                {p.originalPrice && (
                  <div style={{ color: "var(--muted)", textDecoration: "line-through", fontSize: "0.82rem" }}>{p.originalPrice}</div>
                )}
                {p.savings && (
                  <div style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.78rem" }}>{p.savings}</div>
                )}
              </td>
            ))}
          </tr>

          {/* ── Categories ── */}
          <tr style={{ background: "var(--cream)" }}>
            <td style={labelCell}>Type</td>
            {products.map(p => (
              <td key={p.id} style={{ ...dataCell, textAlign: "center" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                  {p.categories.map(c => (
                    <span key={c} style={tagStyle}>{c}</span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* ── Features / Tags ── */}
          <tr>
            <td style={labelCell}>Features</td>
            {products.map(p => (
              <td key={p.id} style={{ ...dataCell, textAlign: "center" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                  {p.tags.map(t => (
                    <span key={t} style={tagStyle}>{t}</span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* ── Pros ── */}
          <tr style={{ background: "var(--cream)" }}>
            <td style={labelCell}>Pros</td>
            {products.map(p => (
              <td key={p.id} style={{ ...dataCell }}>
                <div style={{ background: "rgba(90,158,47,0.06)", border: "1px solid rgba(90,158,47,0.2)", borderRadius: 8, padding: "0.75rem" }}>
                  {p.pros.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                      {p.pros.map((pro, i) => (
                        <li key={i} style={{ fontSize: "0.82rem", color: "var(--dark)", display: "flex", gap: 6 }}>
                          <span style={{ color: "var(--green)", flexShrink: 0 }}>+</span>{pro}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontStyle: "italic" }}>—</span>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* ── Cons ── */}
          <tr>
            <td style={labelCell}>Cons</td>
            {products.map(p => (
              <td key={p.id} style={{ ...dataCell }}>
                <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "0.75rem" }}>
                  {p.cons.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                      {p.cons.map((con, i) => (
                        <li key={i} style={{ fontSize: "0.82rem", color: "var(--dark)", display: "flex", gap: 6 }}>
                          <span style={{ color: "#ef4444", flexShrink: 0 }}>−</span>{con}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontStyle: "italic" }}>—</span>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* ── Buy buttons ── */}
          <tr style={{ background: "var(--cream)" }}>
            <td style={labelCell}>Buy</td>
            {products.map(p => (
              <td key={p.id} style={{ ...dataCell, textAlign: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {p.affiliateLinks.length > 0 ? p.affiliateLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="sponsored noopener noreferrer" style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: "white", border: "1px solid rgba(26,107,42,0.2)", borderRadius: 8,
                      padding: "8px 12px", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600, color: "var(--dark)",
                    }}>
                      <span>{link.retailer}</span>
                      {link.price && <span style={{ color: "var(--green)", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}>{link.price}</span>}
                    </a>
                  )) : (
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontStyle: "italic" }}>No links</span>
                  )}
                </div>
              </td>
            ))}
          </tr>

        </tbody>
      </table>
    </div>
  );
}

const labelCell: React.CSSProperties = {
  padding: "1rem 1.25rem",
  fontWeight: 700,
  fontSize: "0.78rem",
  color: "var(--muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
  width: 110,
  borderRight: "1px solid #e5e1db",
};

const dataCell: React.CSSProperties = {
  padding: "1rem 1.25rem",
  verticalAlign: "middle",
  borderRight: "1px solid #f0ede8",
  minWidth: 220,
};

const tagStyle: React.CSSProperties = {
  background: "var(--cream)",
  color: "var(--muted)",
  padding: "2px 8px",
  borderRadius: 4,
  fontSize: "0.7rem",
  fontWeight: 500,
};
