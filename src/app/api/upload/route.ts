import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.size) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(filename, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
