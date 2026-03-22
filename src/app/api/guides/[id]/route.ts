import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const guide = await prisma.guide.update({ where: { id: Number(id) }, data: body });
  return NextResponse.json(guide);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.guide.delete({ where: { id: Number(id) } });
  return NextResponse.json({ deleted: true });
}
