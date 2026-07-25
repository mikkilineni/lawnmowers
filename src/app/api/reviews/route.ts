import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { seedIfEmpty } from "@/lib/seed";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  await seedIfEmpty();
  const reviews = await prisma.review.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await request.json();
  const review = await prisma.review.create({ data: body });
  return NextResponse.json(review, { status: 201 });
}
