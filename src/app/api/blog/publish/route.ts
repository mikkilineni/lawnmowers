import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const secret = process.env.PUBLISH_SECRET;
  const authHeader = request.headers.get("authorization");
  const hasSecretAuth = secret && authHeader === `Bearer ${secret}`;

  if (!hasSecretAuth) {
    const deny = await requireAdmin();
    if (deny) return deny;
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, slug, content, excerpt, topic, seoScore, reviewed, published } = body;

  const missing: string[] = [];
  if (!title) missing.push("title");
  if (!slug) missing.push("slug");
  if (!content) missing.push("content");
  if (!excerpt) missing.push("excerpt");
  if (!topic) missing.push("topic");

  if (missing.length > 0) {
    return NextResponse.json(
      { success: false, error: "Missing required fields", fields: missing },
      { status: 400 }
    );
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json(
      { success: false, error: "Invalid slug format. Use lowercase letters, numbers, and hyphens only." },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `A blog post with slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        topic,
        seoScore: seoScore != null ? Number(seoScore) : null,
        reviewed: reviewed ?? false,
        published: published ?? true,
      },
    });

    revalidatePath("/blog");

    return NextResponse.json(
      { success: true, blogPost: { id: blogPost.id, slug: blogPost.slug, title: blogPost.title } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[publish] error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
