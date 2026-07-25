import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(brands);
}

export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { name } = await request.json();
  const brand = await prisma.brand.create({ data: { name: name.trim().toUpperCase() } });
  return NextResponse.json(brand, { status: 201 });
}
