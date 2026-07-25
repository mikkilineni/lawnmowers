export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Lawnmower Blog — Tips, Reviews & Buying Guides | Lawnmowers.com",
  description: "Expert lawnmower advice: buying guides, maintenance tips, mower comparisons, and seasonal care — updated daily.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Lawnmower Blog",
    description: "Expert lawnmower advice updated daily.",
    url: "/blog",
    siteName: "Lawnmowers.com",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, topic: true, seoScore: true, createdAt: true },
  });

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
          <Link href="/blog" style={{ color: "#a8d832", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Blog</Link>
          <Link href="/#guides" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem" }}>Guides</Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ padding: "1rem 7%", fontSize: "0.8rem", color: "var(--muted, #8b8680)" }}>
        <Link href="/" style={{ color: "var(--green, #1a6b2a)", textDecoration: "none" }}>Home</Link>
        {" / "}
        <span>Blog</span>
      </div>

      <main style={{ padding: "0 7% 5rem", maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--dark, #1c2e0e)", letterSpacing: "0.02em",
            margin: "0 0 0.5rem",
          }}>
            Lawnmower Blog
          </h1>
          <p style={{ color: "var(--muted, #8b8680)", fontSize: "0.97rem", margin: 0 }}>
            Expert advice on mowers, maintenance, and lawn care — published daily.
          </p>
        </div>

        {/* Post grid */}
        {posts.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, padding: "3rem 2.5rem", textAlign: "center", color: "var(--muted, #8b8680)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            No posts yet. Check back soon!
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {posts.map((post) => (
              <article key={post.id} className="blog-card" style={{
                background: "white", borderRadius: 16,
                padding: "1.75rem 2rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}>
                {/* Topic + SEO score */}
                <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{
                    background: "#e8f5e9", color: "#1a6b2a",
                    padding: "2px 10px", borderRadius: 4,
                    fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
                  }}>
                    {post.topic.toUpperCase()}
                  </span>
                  {post.seoScore != null && (
                    <span style={{ fontSize: "0.75rem", color: "var(--muted, #8b8680)" }}>
                      SEO {post.seoScore}/100
                    </span>
                  )}
                </div>

                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <h2 className="blog-title" style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.4rem", letterSpacing: "0.02em",
                    color: "var(--dark, #1c2e0e)", margin: "0 0 0.5rem",
                  }}>
                    {post.title}
                  </h2>
                </Link>

                <p style={{ color: "var(--muted, #8b8680)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1rem" }}>
                  {post.excerpt}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <time style={{ fontSize: "0.78rem", color: "var(--muted, #8b8680)" }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                  <Link href={`/blog/${post.slug}`} style={{
                    color: "#1a6b2a", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
                  }}>
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .blog-title { transition: color 0.15s; }
        .blog-card:hover .blog-title { color: #1a6b2a; }
      `}</style>
    </div>
  );
}
