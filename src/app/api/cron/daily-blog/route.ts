import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import prisma from "@/lib/prisma";
import { postToLinkedIn, postToFacebook, postToTwitter, postToThreads } from "@/lib/social";

export const maxDuration = 60; // Vercel Pro: up to 60s

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Topic pool ──────────────────────────────────────────────────────────────
const TOPICS = [
  "Best Riding Mowers for 1 Acre",
  "Best Riding Mowers for 2+ Acres",
  "Push Mower Buying Guide",
  "Self-Propelled vs Push Mowers",
  "Robotic Lawn Mowers: Are They Worth It?",
  "Zero-Turn Mowers for Homeowners",
  "Electric vs Gas Lawn Mowers",
  "Best Battery-Powered Mowers",
  "Best Mowers Under $500",
  "Best Mowers Under $1,000",
  "Best Mowers for Slopes and Hills",
  "Best Mowers for Small Yards",
  "Husqvarna Mower Lineup Review",
  "John Deere E Series Review",
  "Honda Lawn Mower Review",
  "Toro Recycler Review",
  "Greenworks Cordless Mowers",
  "EGO Power+ Mowers Review",
  "How to Sharpen Lawn Mower Blades",
  "Lawn Mower Maintenance Schedule",
  "How to Winterize a Lawn Mower",
  "Spring Lawn Mower Tune-Up Guide",
  "Mulching vs Bagging Grass Clippings",
  "How Often Should You Mow?",
  "Mowing Tips for a Healthier Lawn",
  "Best Time of Day to Mow",
  "How to Mow a Lawn in Strips",
  "Lawn Mower Safety Tips",
  "How to Store a Lawn Mower",
  "Common Lawn Mower Problems and Fixes",
  "Why Your Mower Won't Start (And How to Fix It)",
  "Riding Mower vs Zero-Turn: Which Is Right for You?",
];

// ── Generate blog post with Claude ──────────────────────────────────────────
async function generateBlogPost(topic: string, existingSlugs: string[]) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are an expert lawn care writer for lawnmowers.com — a trusted affiliate review site. Write a comprehensive, SEO-optimized blog post about: "${topic}"

Guidelines:
- Write in a friendly, expert voice — like a knowledgeable neighbor, not a corporate brochure
- Be specific: name real products, models, and prices where relevant
- Content: 900–1200 words, rich HTML (use h2, h3, p, ul, li, strong — no h1)
- Include a practical takeaway in the final paragraph
- Slug must be unique — do NOT use any of these: ${existingSlugs.slice(-20).join(", ")}
- Topic must be one of: Mower Types | Maintenance Tips | Buying Guides | Seasonal Care | Brand Reviews | Mowing Tips

Return ONLY valid JSON (no markdown fences, no preamble):
{
  "title": "...",
  "slug": "...",
  "content": "<h2>...</h2><p>...</p>...",
  "excerpt": "One compelling sentence under 160 characters.",
  "topic": "...",
  "seoScore": 80
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude did not return valid JSON");

  const post = JSON.parse(jsonMatch[0]);

  // Validate required fields
  const required = ["title", "slug", "content", "excerpt", "topic"];
  for (const key of required) {
    if (!post[key]) throw new Error(`Missing field: ${key}`);
  }

  return post as {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    topic: string;
    seoScore: number;
  };
}

// ── Review post for quality + SEO ──────────────────────────────────────────
async function reviewBlogPost(post: { title: string; content: string; excerpt: string }) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Review this lawn care blog post for SEO quality and return an updated score.

Title: ${post.title}
Excerpt: ${post.excerpt}
Content preview: ${post.content.replace(/<[^>]+>/g, " ").slice(0, 600)}

Score it 0–100 based on:
- Keyword usage and density
- Heading structure (h2/h3)
- Content depth and specificity
- Meta description quality (excerpt)
- Readability and value

Return ONLY JSON: { "seoScore": 82, "notes": "..." }`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  return JSON.parse(match[0]) as { seoScore: number; notes: string };
}

// ── Main cron handler ───────────────────────────────────────────────────────
export async function GET(request: Request) {
  // Verify Vercel cron secret
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Load recent posts to avoid duplicate topics/slugs
    const recent = await prisma.blogPost.findMany({
      select: { slug: true, topic: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    const existingSlugs = recent.map((p) => p.slug);
    const recentTopics = new Set(recent.map((p) => p.topic));

    // Pick a fresh topic
    const freshTopics = TOPICS.filter((t) => !recentTopics.has(t));
    const pool = freshTopics.length > 0 ? freshTopics : TOPICS;
    const topic = pool[Math.floor(Math.random() * pool.length)];

    console.log(`[daily-blog] Generating post on: ${topic}`);

    // Step 1: Generate
    const draft = await generateBlogPost(topic, existingSlugs);

    // Step 2: Review for SEO quality
    const review = await reviewBlogPost(draft);
    const finalSeoScore = review?.seoScore ?? draft.seoScore ?? null;

    // Guard against duplicate slug
    const slugExists = await prisma.blogPost.findUnique({ where: { slug: draft.slug } });
    if (slugExists) {
      draft.slug = `${draft.slug}-${Date.now()}`;
    }

    // Step 3: Publish to DB
    const saved = await prisma.blogPost.create({
      data: {
        title: draft.title,
        slug: draft.slug,
        content: draft.content,
        excerpt: draft.excerpt,
        topic: draft.topic,
        seoScore: finalSeoScore,
        reviewed: true,
        published: true,
      },
    });

    const postUrl = `https://www.lawnmowers.com/blog/${saved.slug}`;
    console.log(`[daily-blog] Published: ${postUrl}`);

    // Step 4: Post to all social platforms in parallel
    const [linkedin, facebook, twitter, threads] = await Promise.allSettled([
      postToLinkedIn(saved.title, saved.excerpt, postUrl),
      postToFacebook(saved.title, saved.excerpt, postUrl),
      postToTwitter(saved.title, saved.excerpt, postUrl),
      postToThreads(saved.title, saved.excerpt, postUrl),
    ]);

    return NextResponse.json({
      success: true,
      post: {
        id: saved.id,
        title: saved.title,
        slug: saved.slug,
        url: postUrl,
        topic: saved.topic,
        seoScore: finalSeoScore,
        seoNotes: review?.notes,
      },
      social: {
        linkedin: linkedin.status === "fulfilled" ? linkedin.value : { error: String(linkedin.reason) },
        facebook: facebook.status === "fulfilled" ? facebook.value : { error: String(facebook.reason) },
        twitter: twitter.status === "fulfilled" ? twitter.value : { error: String(twitter.reason) },
        threads: threads.status === "fulfilled" ? threads.value : { error: String(threads.reason) },
      },
    });
  } catch (err) {
    console.error("[daily-blog] pipeline error:", err);
    return NextResponse.json({ error: "Pipeline failed", detail: String(err) }, { status: 500 });
  }
}
