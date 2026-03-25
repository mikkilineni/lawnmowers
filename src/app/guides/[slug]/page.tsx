import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { InArticleAd } from "@/components/InArticleAd";

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
  const guide = await prisma.guide.findUnique({ where: { slug } });
  if (!guide) return { title: "Guide Not Found" };
  const description = stripHtml(guide.content).slice(0, 155);
  const url = `/guides/${slug}`;
  return {
    title: `${guide.title} — Lawnmowers.com`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description,
      url,
      siteName: "Lawnmowers.com",
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await prisma.guide.findUnique({ where: { slug } });
  if (!guide) notFound();

  // Detect if content is HTML (from the editor) or legacy plain text
  const isHtml = guide.content.trimStart().startsWith("<");
  const paragraphs = isHtml ? [] : guide.content.split("\n\n").filter(Boolean);

  // Demote h1 tags in body content to h2 — the hero already has the page H1
  const contentHtml = isHtml
    ? guide.content.replace(/<h1(\s|>)/g, "<h2$1").replace(/<\/h1>/g, "</h2>")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: stripHtml(guide.content).slice(0, 155),
    url: `https://www.lawnmowers.com/guides/${guide.slug}`,
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
          <Link href="/#guides" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.85rem" }}>Guides</Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ padding: "1rem 7%", fontSize: "0.8rem", color: "var(--muted, #8b8680)" }}>
        <Link href="/" style={{ color: "var(--green, #1a6b2a)", textDecoration: "none" }}>Home</Link>
        {" / "}
        <Link href="/#guides" style={{ color: "var(--green, #1a6b2a)", textDecoration: "none" }}>Guides</Link>
        {" / "}
        <span>{guide.title}</span>
      </div>

      <main style={{ padding: "0 7% 5rem", maxWidth: 800, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #1a6b2a 0%, #5a9e2f 100%)",
          borderRadius: 16, padding: "3rem 2.5rem",
          display: "flex", alignItems: "center", gap: "1.5rem",
          marginBottom: "2rem",
        }}>
          <span style={{ fontSize: "4rem", flexShrink: 0 }}>{guide.emoji}</span>
          <div>
            <div style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)", color: "white",
              padding: "3px 12px", borderRadius: 4,
              fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
              marginBottom: "0.75rem",
            }}>{guide.tag.toUpperCase()}</div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "white", letterSpacing: "0.02em",
              lineHeight: 1.1, margin: 0,
            }}>{guide.title}</h1>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", marginTop: "0.75rem", display: "flex", gap: "1rem" }}>
              <span>{guide.readTime}</span>
              <span>{guide.updated}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {guide.content ? (
          <div style={{ background: "white", borderRadius: 16, padding: "2rem 2.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: "1.5rem" }}>
            {isHtml ? (
              <>
                <div className="guide-content" dangerouslySetInnerHTML={{ __html: contentHtml! }} />
                <InArticleAd />
              </>
            ) : (
              paragraphs.map((para, i) => (
                <>
                  <p key={i} style={{ color: "var(--dark, #1c2e0e)", lineHeight: 1.85, fontSize: "0.97rem", marginBottom: "1.25rem" }}>{para}</p>
                  {i === Math.floor(paragraphs.length / 2) - 1 && <InArticleAd key="ad" />}
                </>
              ))
            )}
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 16, padding: "3rem 2.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", textAlign: "center", color: "var(--muted, #8b8680)" }}>
            Content coming soon.
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/#guides" style={{
            color: "var(--green, #1a6b2a)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
          }}>
            ← Back to all guides
          </Link>
        </div>
      </main>

      <style>{`
        .guide-content { color: var(--dark, #1c2e0e); font-size: 0.97rem; line-height: 1.85; }
        .guide-content p { margin: 0 0 1.1rem; }
        .guide-content h2 { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.02em; margin: 2rem 0 0.75rem; }
        .guide-content h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: 0.02em; margin: 1.5rem 0 0.5rem; }
        .guide-content ul, .guide-content ol { padding-left: 1.5rem; margin: 0 0 1.1rem; }
        .guide-content li { margin-bottom: 0.4rem; }
        .guide-content blockquote { border-left: 3px solid #a8d832; padding: 0.25rem 0 0.25rem 1rem; color: #666; margin: 1.25rem 0; font-style: italic; }
        .guide-content hr { border: none; border-top: 1px solid #e5e1db; margin: 1.5rem 0; }
        .guide-content a { color: #1a6b2a; text-decoration: underline; }
        .guide-content strong { font-weight: 700; }
      `}</style>
    </div>
  );
}
