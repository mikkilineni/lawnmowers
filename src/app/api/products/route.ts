import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { seedIfEmpty } from "@/lib/seed";

export async function GET(request: Request) {
  await seedIfEmpty();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const products = await prisma.product.findMany({ orderBy: { id: "asc" }, include: { affiliateLinks: true } });

  const filtered = category && category !== "all"
    ? products.filter((p) => {
        const cats: string[] = JSON.parse(p.categories);
        return cats.includes(category);
      })
    : products;

  return NextResponse.json(
    filtered.map((p) => ({
      ...p,
      tags: JSON.parse(p.tags),
      categories: JSON.parse(p.categories),
    }))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      ...body,
      tags: JSON.stringify(body.tags ?? []),
      categories: JSON.stringify(body.categories ?? []),
    },
  });
  return NextResponse.json(product, { status: 201 });
}
