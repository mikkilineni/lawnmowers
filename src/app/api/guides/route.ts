import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { seedIfEmpty } from "@/lib/seed";

export async function GET() {
  await seedIfEmpty();
  const guides = await prisma.guide.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(guides);
}

export async function POST(request: Request) {
  const body = await request.json();
  const guide = await prisma.guide.create({ data: body });
  return NextResponse.json(guide, { status: 201 });
}
