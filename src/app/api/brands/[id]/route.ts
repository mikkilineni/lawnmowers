import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await prisma.brand.delete({ where: { id: Number(id) } });
  return NextResponse.json({ deleted: true });
}
