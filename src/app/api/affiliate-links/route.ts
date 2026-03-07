import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  const links = await prisma.affiliateLink.findMany({
    where: productId ? { productId: Number(productId) } : undefined,
    include: { product: { select: { name: true, brand: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const body = await request.json();
  const link = await prisma.affiliateLink.create({
    data: {
      productId: Number(body.productId),
      retailer: body.retailer,
      url: body.url,
      price: body.price ?? "",
    },
  });
  return NextResponse.json(link, { status: 201 });
}
