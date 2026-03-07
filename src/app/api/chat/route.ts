import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import prisma from "@/lib/prisma";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Chat not configured" }, { status: 503 });
  }

  const { messages } = await request.json();

  const products = await prisma.product.findMany({
    include: { affiliateLinks: true },
    orderBy: { id: "asc" },
  });

  const catalogLines = products
    .map((p) => {
      const cats = JSON.parse(p.categories).join(", ");
      const retailers = p.affiliateLinks.map((l) => l.retailer).join(", ");
      return `ID:${p.id} | ${p.brand} ${p.name} | ${p.price} | ${cats} | Rating:${p.rating}${retailers ? ` | Buy at: ${retailers}` : ""}`;
    })
    .join("\n");

  const systemPrompt = `You are a friendly lawnmower expert for lawnmowers.com. Help visitors find the perfect mower by having a natural conversation.

Ask about (one or two at a time, not all at once):
- Lawn size: small (<1/4 acre), medium (1/4-1 acre), large (1+ acres)
- Terrain: flat, sloped, hilly
- Type preference: push, self-propelled, riding, zero-turn, robotic
- Power: gas, battery/electric, or no preference
- Budget
- Special needs (quiet, low maintenance, no emissions, etc.)

After 2-3 exchanges when you have enough info, recommend 1-3 specific products. Prioritize products that have "Buy at:" retailers listed.

PRODUCT CATALOG:
${catalogLines}

When recommending products, end your message with this exact tag:
<rec>{"ids":[LIST_OF_PRODUCT_IDS_HERE]}</rec>

Example: <rec>{"ids":[3,7,12]}</rec>

Only include this tag when you have specific product recommendations. Keep responses concise and friendly.`;

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const fullText =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract <rec> tag using indexOf to avoid regex s-flag compatibility issues
  let recommendedIds: number[] = [];
  const recStart = fullText.indexOf("<rec>");
  const recEnd = fullText.indexOf("</rec>");
  if (recStart !== -1 && recEnd !== -1) {
    try {
      const json = fullText.slice(recStart + 5, recEnd);
      recommendedIds = JSON.parse(json).ids ?? [];
    } catch {}
  }

  const cleanMessage =
    recStart !== -1
      ? fullText.slice(0, recStart).trim()
      : fullText.trim();

  const recommendedProducts =
    recommendedIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: recommendedIds } },
          include: { affiliateLinks: true },
          orderBy: { id: "asc" },
        })
      : [];

  return NextResponse.json({
    message: cleanMessage,
    recommendedProducts: recommendedProducts.map((p) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      price: p.price,
      image: p.image,
      emoji: p.emoji,
      rating: p.rating,
      affiliateLinks: p.affiliateLinks.map((l) => ({
        id: l.id,
        retailer: l.retailer,
        url: l.url,
        price: l.price,
      })),
    })),
  });
}
