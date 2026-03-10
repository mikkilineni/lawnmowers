export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

interface Extras {
  tagline?: string;
  verdictLabel?: string;
  quickSpecs?: Record<string, string>;
  badges?: string[];
  specsTable?: { label: string; value: string }[];
  keyFeatures?: string;
  whoShouldBuy?: string;
  faq?: { q: string; a: string }[];
  keySpecs?: Record<string, string>;
  bestFor?: string;
  navigation?: string;
  wireFree?: string;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ color: "#d4a843", fontSize: 18, letterSpacing: 1 }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(empty)}
    </span>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  const extras: Extras = JSON.parse(product.extrasJson || "{}");
  return {
    title: `${product.brand} ${product.name} Review 2026 — Specs, Price, Pros & Cons | lawnmowers.com`,
    description: extras.tagline || product.description,
    alternates: { canonical: `https://www.lawnmowers.com/reviews/robotic/${slug}/` },
    openGraph: {
      title: `${product.brand} ${product.name} Review 2026`,
      description: extras.tagline || product.description,
      url: `https://www.lawnmowers.com/reviews/robotic/${slug}/`,
    },
  };
}

export default async function RoboticReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { affiliateLinks: true },
  });
  if (!product) notFound();

  const extras: Extras = JSON.parse(product.extrasJson || "{}");
  const pros = product.pros ? product.pros.split("\n").filter(Boolean) : [];
  const cons = product.cons ? product.cons.split("\n").filter(Boolean) : [];
  const quickSpecs = extras.quickSpecs ?? {};
  const specsTable = extras.specsTable ?? [];
  const faq = extras.faq ?? [];
  const keySpecs = extras.keySpecs ?? {};
  const badges = extras.badges ?? [];

  const green = "#1b7a3d";
  const greenDark = "#145a2d";
  const greenLight = "#e8f5ec";
  const bg = "#f8f6f1";
  const card = "#ffffff";
  const muted = "#6b6960";
  const border = "#e5e1d8";
  const light = "#f0ede5";
  const gold = "#d4a843";

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif", color: "#1a1a18", lineHeight: 1.65 }}>

      {/* Site Header */}
      <header style={{ background: "rgba(14,26,15,0.97)", padding: "0 5%", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(168,216,50,0.15)" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" height="36">
            <rect x="0" y="4" width="56" height="56" rx="11" fill="#5a9e2f"/>
            <rect x="9"  y="14" width="3" height="7"  rx="1.5" fill="#a8d832"/>
            <rect x="15" y="12" width="3" height="9"  rx="1.5" fill="#a8d832"/>
            <rect x="21" y="13" width="3" height="8"  rx="1.5" fill="#a8d832"/>
            <rect x="27" y="12" width="3" height="9"  rx="1.5" fill="#a8d832"/>
            <rect x="33" y="14" width="3" height="7"  rx="1.5" fill="#a8d832"/>
            <rect x="7" y="20" width="32" height="11" rx="3" fill="white"/>
            <circle cx="13" cy="36" r="6" fill="white"/><circle cx="13" cy="36" r="2.4" fill="#5a9e2f"/>
            <circle cx="34" cy="36" r="6" fill="white"/><circle cx="34" cy="36" r="2.4" fill="#5a9e2f"/>
            <line x1="39" y1="26" x2="52" y2="10" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
            <text x="70" y="47" fontFamily="'Bebas Neue', Arial, sans-serif" fontSize="38" letterSpacing="1">
              <tspan fill="#a8d832">Lawn</tspan><tspan fill="white">mowers</tspan><tspan fill="#78be44" fontSize="28" dy="4">.com</tspan>
            </text>
          </svg>
        </Link>
        <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/#products" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>Top Picks</Link>
          <Link href="/#guides" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>Guides</Link>
          <Link href="/" style={{ background: "#a8d832", color: "#0e1a0f", padding: "8px 18px", borderRadius: 6, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}>
            All Mowers
          </Link>
        </nav>
      </header>

      {/* Breadcrumb */}
      <nav style={{ maxWidth: 1100, margin: "16px auto 0", padding: "0 20px", fontSize: 12, color: muted }}>
        <Link href="/" style={{ color: green, textDecoration: "none" }}>Home</Link>
        <span style={{ margin: "0 6px" }}>›</span>
        <Link href="/#products" style={{ color: green, textDecoration: "none" }}>Reviews</Link>
        <span style={{ margin: "0 6px" }}>›</span>
        <span>Robotic Mowers</span>
        <span style={{ margin: "0 6px" }}>›</span>
        <span>{product.brand} {product.name}</span>
      </nav>

      {/* Main layout */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>

        {/* ── REVIEW HEADER (full width) ── */}
        <div style={{ gridColumn: "1 / -1", background: card, borderRadius: 14, padding: "32px 36px", border: `1px solid ${border}` }}>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: green, fontWeight: 700, marginBottom: 4 }}>{product.brand}</div>
          <h1 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>
            {product.brand} {product.name} Review
          </h1>
          {extras.tagline && (
            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic", color: muted, fontSize: 17, marginBottom: 16 }}>
              {extras.tagline}
            </p>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {badges.map((b, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.5px", textTransform: "uppercase", background: i === 0 ? greenLight : "#eee", color: i === 0 ? green : "#666" }}>
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: light, padding: "10px 18px", borderRadius: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 28, fontWeight: 700, color: green }}>{product.rating.toFixed(1)}</span>
            <div>
              <Stars rating={product.rating} />
              <div style={{ fontSize: 12, color: muted }}>lawnmowers.com Rating</div>
            </div>
          </div>

          {/* Quick specs bar */}
          {Object.keys(quickSpecs).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", borderTop: `1px solid ${border}`, paddingTop: 16, marginTop: 8 }}>
              {Object.entries(quickSpecs).map(([label, value]) => (
                <div key={label} style={{ flex: 1, minWidth: 120, textAlign: "center", padding: "8px 12px", borderRight: `1px solid ${border}` }}>
                  <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: muted, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── LEFT: REVIEW CONTENT ── */}
        <main>
          {/* Verdict */}
          {product.review && (
            <>
              <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, margin: "0 0 14px", paddingBottom: 8, borderBottom: `2px solid ${green}` }}>Our Verdict</h2>
              <div style={{ background: card, borderRadius: 12, padding: "24px 28px", border: `1px solid ${border}`, marginBottom: 24 }}>
                {extras.verdictLabel && (
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: green, fontWeight: 700, marginBottom: 10 }}>{extras.verdictLabel}</div>
                )}
                {product.review.split("\n\n").map((para, i) => (
                  <p key={i} style={{ marginBottom: 14, fontSize: 15, lineHeight: 1.7 }}>{para}</p>
                ))}
              </div>
            </>
          )}

          {/* Pros & Cons */}
          {(pros.length > 0 || cons.length > 0) && (
            <>
              <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, margin: "28px 0 14px", paddingBottom: 8, borderBottom: `2px solid ${green}` }}>Pros &amp; Cons</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ background: card, borderRadius: 12, padding: "20px 22px", border: `1px solid ${border}`, borderTop: `3px solid ${green}` }}>
                  <h3 style={{ color: green, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>✓ What We Like</h3>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {pros.map((p, i) => <li key={i} style={{ fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>{p}</li>)}
                  </ul>
                </div>
                <div style={{ background: card, borderRadius: 12, padding: "20px 22px", border: `1px solid ${border}`, borderTop: "3px solid #e74c3c" }}>
                  <h3 style={{ color: "#e74c3c", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>✗ What Could Be Better</h3>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {cons.map((c, i) => <li key={i} style={{ fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Full specs table */}
          {specsTable.length > 0 && (
            <>
              <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, margin: "28px 0 14px", paddingBottom: 8, borderBottom: `2px solid ${green}` }}>Full Specifications</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
                <tbody>
                  {specsTable.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, fontSize: 13, color: muted, width: "40%", background: light }}>{row.label}</td>
                      <td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 500 }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Key features */}
          {extras.keyFeatures && (
            <>
              <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, margin: "28px 0 14px", paddingBottom: 8, borderBottom: `2px solid ${green}` }}>Key Features</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{extras.keyFeatures}</p>
            </>
          )}

          {/* Who should buy */}
          {extras.whoShouldBuy && (
            <>
              <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, margin: "28px 0 14px", paddingBottom: 8, borderBottom: `2px solid ${green}` }}>Who Should Buy the {product.name}?</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{extras.whoShouldBuy}</p>
            </>
          )}

          {/* FAQ */}
          {faq.length > 0 && (
            <>
              <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, margin: "28px 0 14px", paddingBottom: 8, borderBottom: `2px solid ${green}` }}>Frequently Asked Questions</h2>
              <div style={{ marginBottom: 24 }}>
                {faq.map((item, i) => (
                  <details key={i} style={{ border: `1px solid ${border}`, borderRadius: 10, marginBottom: 10, overflow: "hidden", background: card }}>
                    <summary style={{ padding: "14px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {item.q}
                      <span style={{ color: green, fontWeight: 700, fontSize: 18, flexShrink: 0 }}>+</span>
                    </summary>
                    <p style={{ padding: "0 18px 14px", fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{item.a}</p>
                  </details>
                ))}
              </div>
            </>
          )}
        </main>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Price / Buy box */}
          {product.affiliateLinks.length > 0 && (
            <div style={{ background: card, borderRadius: 12, padding: 20, border: `2px solid ${green}` }}>
              <div style={{ background: green, color: "#fff", margin: "-20px -20px 16px", padding: "12px 20px", borderRadius: "10px 10px 0 0" }}>
                <h3 style={{ color: "#fff", margin: 0, fontSize: 14 }}>Where to Buy — Best Prices</h3>
              </div>
              {product.affiliateLinks.map(link => (
                <div key={link.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{link.retailer}</span>
                  <span style={{ fontWeight: 700, fontSize: 15, color: green }}>{link.price}</span>
                </div>
              ))}
              <a href={product.affiliateLinks[0]?.url ?? "#"} target="_blank" rel="sponsored noopener noreferrer"
                style={{ display: "block", textAlign: "center", background: green, color: "#fff", padding: 12, borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14, marginTop: 14 }}>
                Check Latest Prices →
              </a>
            </div>
          )}

          {/* Key specs */}
          {Object.keys(keySpecs).length > 0 && (
            <div style={{ background: card, borderRadius: 12, padding: 20, border: `1px solid ${border}` }}>
              <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 16, marginBottom: 14 }}>Key Specifications</h3>
              {Object.entries(keySpecs).map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${border}`, fontSize: 13 }}>
                  <span style={{ color: muted }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Best for */}
          {extras.bestFor && (
            <div style={{ background: greenLight, borderRadius: 12, padding: 20, border: `1px solid ${green}` }}>
              <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 16, color: green, marginBottom: 8 }}>Best For</h3>
              <p style={{ fontSize: 14, margin: 0 }}>{extras.bestFor}</p>
            </div>
          )}

          {/* Back to all reviews */}
          <div style={{ background: greenDark, borderRadius: 12, padding: 20, textAlign: "center" }}>
            <h3 style={{ color: gold, fontSize: 15, marginBottom: 8 }}>Compare More Robotic Mowers</h3>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 12 }}>See all robotic mower reviews and find the best fit for your yard.</p>
            <Link href="/#products" style={{ display: "block", padding: 10, background: gold, color: "#1a1a18", borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Browse All Reviews →
            </Link>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0e1a0f", color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "2rem", fontSize: 13 }}>
        <p><strong style={{ color: "white" }}>lawnmowers.com</strong> — The Definitive Lawn Mower Resource</p>
        <p style={{ marginTop: 8 }}>
          <Link href="/#products" style={{ color: "#a8d832", textDecoration: "none", marginRight: 16 }}>All Reviews</Link>
          <Link href="/#guides" style={{ color: "#a8d832", textDecoration: "none" }}>Buying Guides</Link>
        </p>
        <p style={{ marginTop: 12, fontSize: 11, opacity: 0.5 }}>© 2026 lawnmowers.com. As an affiliate, we earn from qualifying purchases.</p>
      </footer>
    </div>
  );
}
