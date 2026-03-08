import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function searchReddit(query: string): Promise<string[]> {
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=5&type=link`;
  const res = await fetch(url, {
    headers: { "User-Agent": "lawnmowers-review-bot/1.0" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data.children
    .map((c: { data: { permalink: string } }) => `https://www.reddit.com${c.data.permalink}`)
    .slice(0, 3);
}

async function fetchThreadComments(permalink: string): Promise<string> {
  const url = `${permalink}.json?limit=30&depth=2`;
  const res = await fetch(url, {
    headers: { "User-Agent": "lawnmowers-review-bot/1.0" },
  });
  if (!res.ok) return "";

  const data = await res.json();
  const lines: string[] = [];

  // Post title + body
  const post = data[0]?.data?.children?.[0]?.data;
  if (post?.title) lines.push(`POST: ${post.title}`);
  if (post?.selftext) lines.push(post.selftext.slice(0, 500));

  // Top comments
  const comments = data[1]?.data?.children ?? [];
  for (const c of comments) {
    const body = c.data?.body;
    if (body && body !== "[deleted]" && body !== "[removed]") {
      lines.push(`COMMENT: ${body.slice(0, 400)}`);
    }
  }

  return lines.join("\n").slice(0, 3000);
}

export async function POST(request: Request) {
  const { brand, name } = await request.json();

  if (!brand || !name) {
    return NextResponse.json({ error: "brand and name are required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  try {
    // Search Reddit for threads about this product
    const query = `${brand} ${name} review`;
    const permalinks = await searchReddit(query);

    if (permalinks.length === 0) {
      return NextResponse.json({ error: "No Reddit threads found for this product" }, { status: 404 });
    }

    // Fetch comments from top threads
    const threadTexts = await Promise.all(permalinks.map(fetchThreadComments));
    const combinedText = threadTexts.filter(Boolean).join("\n\n---\n\n").slice(0, 8000);

    if (!combinedText.trim()) {
      return NextResponse.json({ error: "Could not extract content from Reddit threads" }, { status: 404 });
    }

    // Ask Claude to generate structured review content
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a lawnmower expert writing a product review for lawnmowers.com.

Based on the following Reddit discussions about the ${brand} ${name}, generate:
1. A full review paragraph (3-4 sentences, factual and balanced)
2. Up to 5 pros (one per line, short phrases)
3. Up to 5 cons (one per line, short phrases)

Reddit content:
${combinedText}

Respond in this exact JSON format:
{
  "review": "...",
  "pros": ["...", "..."],
  "cons": ["...", "..."]
}`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse Claude response" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      review: result.review ?? "",
      pros: (result.pros ?? []).join("\n"),
      cons: (result.cons ?? []).join("\n"),
      sources: permalinks,
    });
  } catch (err) {
    console.error("generate-review error:", err);
    return NextResponse.json({ error: "Failed to generate review" }, { status: 500 });
  }
}
