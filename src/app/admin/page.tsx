export const dynamic = "force-dynamic";

import Link from "next/link";
import prisma from "@/lib/prisma";
import { seedIfEmpty } from "@/lib/seed";
import { AdminHeader } from "@/components/AdminHeader";

export default async function AdminPage() {
  await seedIfEmpty();
  const [products, reviews, guides, categories, affiliateLinks] = await Promise.all([
    prisma.product.count(),
    prisma.review.count(),
    prisma.guide.count(),
    prisma.category.count(),
    prisma.affiliateLink.count(),
  ]);

  const cards = [
    { label: "Products", count: products, href: "/admin/products", emoji: "🌿" },
    { label: "Affiliate Links", count: affiliateLinks, href: "/admin/affiliate-links", emoji: "🔗" },
    { label: "Reviews", count: reviews, href: "/admin/reviews", emoji: "⭐" },
    { label: "Guides", count: guides, href: "/admin/guides", emoji: "📖" },
    { label: "Categories", count: categories, href: "/admin/categories", emoji: "📂" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <AdminHeader />

      <main style={{ padding: "3rem 7%" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--dark)", marginBottom: "2rem", letterSpacing: "0.02em" }}>
          Content Management
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {cards.map(c => (
            <Link key={c.label} href={c.href} style={{
              background: "white",
              borderRadius: 12,
              padding: "2rem",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "2px solid transparent",
              display: "block",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{c.emoji}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--green)" }}>{c.count}</div>
              <div style={{ fontWeight: 600, color: "var(--dark)", fontSize: "0.95rem" }}>{c.label}</div>
              <div style={{ color: "var(--green)", fontSize: "0.78rem", marginTop: 4 }}>Manage →</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
