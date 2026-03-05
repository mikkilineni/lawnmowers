import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { seedIfEmpty } from "@/lib/seed";

export async function GET() {
  await seedIfEmpty();
  const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const category = await prisma.category.create({ data: body });
  return NextResponse.json(category, { status: 201 });
}
