"use client";

import Link from "next/link";
import type { ProductSpecs } from "@/types/specs";

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
  specsJson: string;
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

// ── Spec row definitions ────────────────────────────────────────────────────

interface SpecRowDef {
  label: string;
  key: keyof ProductSpecs;
  unit?: string;
  better?: "higher" | "lower"; // undefined = no highlight
  format?: (v: unknown, specs?: ProductSpecs) => string;
}

const SPEC_ROWS: SpecRowDef[] = [
  { label: "Power Type",      key: "powerType",        format: v => String(v ?? "").charAt(0).toUpperCase() + String(v ?? "").slice(1) },
  { label: "Engine CC",       key: "engineCC",         unit: "cc",   better: "higher" },
  { label: "Voltage",         key: "voltage",          unit: "V",    better: "higher" },
  { label: "Battery",         key: "batteryAh",        unit: "Ah",   better: "higher" },
  { label: "Horsepower",      key: "horsepower",       unit: "HP",   better: "higher" },
  { label: "Deck Width",      key: "deckWidth",        unit: "\"",   better: "higher" },
  { label: "Cut Height",      key: "cuttingHeightMin", unit: "–",    format: (_, specs) => {
    const s = specs as ProductSpecs;
    if (s.cuttingHeightMin != null && s.cuttingHeightMax != null)
      return `${s.cuttingHeightMin}"–${s.cuttingHeightMax}"`;
    if (s.cuttingHeightMax != null) return `up to ${s.cuttingHeightMax}"`;
    if (s.cuttingHeightMin != null) return `${s.cuttingHeightMin}"`;
    return "—";
  }},
  { label: "Height Positions", key: "cuttingPositions", better: "higher" },
  { label: "Drive Type",      key: "driveType",        format: v => String(v ?? "").toUpperCase() || "—" },
  { label: "Max Speed",       key: "speedMax",         unit: " MPH", better: "higher" },
  { label: "Runtime",         key: "runtimeMinutes",   unit: " min", better: "higher" },
  { label: "Charge Time",     key: "chargeTimeMinutes",unit: " min", better: "lower" },
  { label: "Coverage",        key: "acreageCoverage",  unit: " acres", better: "higher" },
  { label: "Weight",          key: "weightLbs",        unit: " lbs", better: "lower" },
  { label: "Max Slope",       key: "slopeMax",         unit: "°",    better: "higher" },
  { label: "Installation",    key: "installation",     format: v => v ? String(v) : "—" },
  { label: "GPS",             key: "gpsType",          format: v => v ? String(v) : "—" },
  { label: "Mulching",        key: "mulching",         format: v => v ? "✓" : "—" },
  { label: "Bagging",         key: "bagging",          format: v => v ? "✓" : "—" },
  { label: "Side Discharge",  key: "sideDischarge",    format: v => v ? "✓" : "—" },
  { label: "App Control",     key: "appControl",       format: v => v ? "✓" : "—" },
  { label: "Self-Propelled",  key: "selfPropelled",    format: v => v ? "✓" : "—" },
  { label: "Warranty",        key: "warrantyYears",    unit: " yrs", better: "higher" },
];

export function CompareTable({ products }: { products: CompareProduct[] }) {
  const n = products.length;

  // Parse specs for each product
  const specs: ProductSpecs[] = products.map(p => {
    try { return JSON.parse(p.specsJson || "{}") as ProductSpecs; }
    catch { return {}; }
  });

  // Compute best values for numeric rows
  const bestValues: Record<string, number> = {};
  for (const row of SPEC_ROWS) {
    if (!row.better) continue;
    const vals = specs.map(s => s[row.key] as number | undefined).filter((v): v is number => v != null);
    if (vals.length < 2) continue;
    bestValues[row.key] = row.better === "higher" ? Math.max(...vals) : Math.min(...vals);
  }

  // Check if any product has specs
  const hasSpecs = specs.some(s => Object.keys(s).length > 0);

  function renderSpecValue(row: SpecRowDef, i: number): string {
    const s = specs[i];
    const rawVal = s[row.key];
    if (rawVal == null || rawVal === "") return "—";
    if (row.format) {
      // pass full specs for multi-field rows
      return (row.format as (v: unknown, specs?: ProductSpecs) => string)(rawVal, s);
    }
    return `${rawVal}${row.unit ?? ""}`;
  }

  function isBest(row: SpecRowDef, i: number): boolean {
    if (!row.better) return false;
    const best = bestValues[row.key];
    if (best == null) return false;
    const val = specs[i][row.key] as number | undefined;
    return val === best;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      {/* Share button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", padding: "1rem 1.25rem 0" }}>
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

          {/* ── Specifications Section ── */}
          {hasSpecs && (
            <>
              <tr>
                <td colSpan={n + 1} style={{
                  padding: "0.6rem 1.25rem",
                  background: "var(--dark)",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1rem",
                  color: "var(--lime, #a8d832)",
                  letterSpacing: "0.12em",
                }}>
                  SPECIFICATIONS
                </td>
              </tr>

              {SPEC_ROWS.map((row, ri) => {
                const vals = products.map((_, i) => renderSpecValue(row, i));
                // Skip row if all values are "—"
                if (vals.every(v => v === "—")) return null;

                return (
                  <tr key={row.key} style={{ background: ri % 2 === 0 ? "white" : "var(--cream)" }}>
                    <td style={labelCell}>{row.label}</td>
                    {products.map((p, i) => {
                      const best = isBest(row, i);
                      const val = vals[i];
                      return (
                        <td key={p.id} style={{
                          ...dataCell,
                          textAlign: "center",
                          background: best ? "rgba(168,216,50,0.08)" : undefined,
                          borderLeft: best ? "2px solid rgba(168,216,50,0.4)" : undefined,
                        }}>
                          <span style={{
                            fontSize: "0.9rem",
                            fontWeight: best ? 700 : 400,
                            color: val === "✓" ? "var(--green)" : best ? "var(--green)" : val === "—" ? "var(--muted)" : "var(--dark)",
                          }}>
                            {val}
                          </span>
                          {best && (
                            <span style={{ display: "block", fontSize: "0.65rem", color: "var(--green)", fontWeight: 600, marginTop: 1 }}>
                              ▲ BEST
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          )}

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
