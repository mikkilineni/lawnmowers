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

  const systemPrompt = `Lawnmower expert for lawnmowers.com. Ask 1 short question at a time: lawn size, terrain, gas/electric, budget. After 2-3 replies recommend 1-3 products. Prefer products with "Buy at:" listed. Be brief.

PRODUCTS:
${catalogLines}

When recommending, append: <rec>{"ids":[IDS]}</rec>`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
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
