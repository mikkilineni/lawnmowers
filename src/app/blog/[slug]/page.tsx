import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) return { title: "Post Not Found" };
  const description = post.excerpt || stripHtml(post.content).slice(0, 155);
  const url = `/blog/${slug}`;
  return {
    title: `${post.title} — Lawnmowers.com`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: "Lawnmowers.com",
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) notFound();

  const isHtml = post.content.trimStart().startsWith("<");
  const paragraphs = isHtml ? [] : post.content.split("\n\n").filter(Boolean);
  const contentHtml = isHtml
    ? post.content.replace(/<h1(\s|>)/g, "<h2$1").replace(/<\/h1>/g, "</h2>")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || stripHtml(post.content).slice(0, 155),
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `https://www.lawnmowers.com/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Lawnmowers.com",
      url: "https://www.lawnmowers.com",
    },
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--cream, #f8f5f0)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          <Link href="/blog" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem" }}>Blog</Link>
          <Link href="/#guides" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem" }}>Guides</Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ padding: "1rem 7%", fontSize: "0.8rem", color: "var(--muted, #8b8680)" }}>
        <Link href="/" style={{ color: "var(--green, #1a6b2a)", textDecoration: "none" }}>Home</Link>
        {" / "}
        <Link href="/blog" style={{ color: "var(--green, #1a6b2a)", textDecoration: "none" }}>Blog</Link>
        {" / "}
        <span>{post.title}</span>
      </div>

      <main style={{ padding: "0 7% 5rem", maxWidth: 800, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #1a6b2a 0%, #5a9e2f 100%)",
          borderRadius: 16, padding: "3rem 2.5rem",
          marginBottom: "2rem",
        }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
            <span style={{
              background: "rgba(255,255,255,0.15)", color: "white",
              padding: "3px 12px", borderRadius: 4,
              fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
            }}>
              {post.topic.toUpperCase()}
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "white", letterSpacing: "0.02em",
            lineHeight: 1.1, margin: "0 0 1rem",
          }}>
            {post.title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
            {post.excerpt}
          </p>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginTop: "1rem" }}>
            Published {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Content */}
        <div style={{ background: "white", borderRadius: 16, padding: "2rem 2.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: "1.5rem" }}>
          {isHtml ? (
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: contentHtml! }} />
          ) : (
            paragraphs.map((para, i) => (
              <p key={i} style={{ color: "var(--dark, #1c2e0e)", lineHeight: 1.85, fontSize: "0.97rem", marginBottom: "1.25rem" }}>
                {para}
              </p>
            ))
          )}
        </div>

        {/* Back link */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/blog" style={{ color: "var(--green, #1a6b2a)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
            ← Back to all posts
          </Link>
        </div>
      </main>

      <style>{`
        .blog-content { color: var(--dark, #1c2e0e); font-size: 0.97rem; line-height: 1.85; }
        .blog-content p { margin: 0 0 1.1rem; }
        .blog-content h2 { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.02em; margin: 2rem 0 0.75rem; color: #1a6b2a; }
        .blog-content h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: 0.02em; margin: 1.5rem 0 0.5rem; color: #1a6b2a; }
        .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin: 0 0 1.1rem; }
        .blog-content li { margin-bottom: 0.4rem; }
        .blog-content blockquote { border-left: 3px solid #a8d832; padding: 0.25rem 0 0.25rem 1rem; color: #666; margin: 1.25rem 0; font-style: italic; }
        .blog-content hr { border: none; border-top: 1px solid #e5e1db; margin: 1.5rem 0; }
        .blog-content a { color: #1a6b2a; text-decoration: underline; }
        .blog-content strong { font-weight: 700; }
      `}</style>
    </div>
  );
}
