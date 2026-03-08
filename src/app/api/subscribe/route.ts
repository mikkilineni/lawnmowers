import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { name, email } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    const subscriber = await prisma.subscriber.create({
      data: { name: name.trim(), email: email.trim().toLowerCase() },
    });
    return NextResponse.json({ success: true, id: subscriber.id }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
