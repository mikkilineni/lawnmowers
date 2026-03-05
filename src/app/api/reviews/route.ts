import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { seedIfEmpty } from "@/lib/seed";

export async function GET() {
  await seedIfEmpty();
  const reviews = await prisma.review.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const body = await request.json();
  const review = await prisma.review.create({ data: body });
  return NextResponse.json(review, { status: 201 });
}
