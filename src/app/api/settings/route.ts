import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULTS: Record<string, string> = {
  adsEnabled: "false",
  adFrequency: "4",
};

export async function GET() {
  const settings = await prisma.setting.findMany();
  const map = { ...DEFAULTS, ...Object.fromEntries(settings.map(s => [s.key, s.value])) };
  return NextResponse.json(map);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const results = await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );
  return NextResponse.json(results);
}
