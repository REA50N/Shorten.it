import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const createLinkSchema = z.object({
  long_url: z.url("Please enter a valid URL"),
  slug: z
    .string()
    .min(3, "Custom slug must be at least 3 characters")
    .max(10, "Custom slug is too long")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$/, 
      "Slug can only contain letters, numbers, hyphen (-) and underscore (_)")
    .optional(),
});


  
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { long_url ,slug} = createLinkSchema.parse(await req.json())
  const isUrl = z.url().safeParse(long_url)

if(slug){
const exist = await prisma.link.findUnique({
  where:{slugUrl:slug }
})
if (exist) {
  return NextResponse.json({ error: "Custom slug already taken" }, { status: 409 });
 
}}




  if (!isUrl.success) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  const existingLink = await prisma.link.findFirst({ where: { longUrl: long_url } })
  if (existingLink) {
    return NextResponse.json({ short_url: `${process.env.NEXT_PUBLIC_APP_URL}/u/${existingLink.shortUrl}` }, { status: 200 })
  }

  const short_url = nanoid(10)
  const link = await prisma.link.create({
    data: {
      longUrl: long_url,
      shortUrl: short_url,
      slugUrl:slug,
      owner: {
        connect: {
          id: session.user.id
        }
      }
    }
  })

  return NextResponse.json({ short_url: `${process.env.NEXT_PUBLIC_APP_URL}/u/${link.shortUrl}` }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const allLinks = await prisma.link.findMany({ where: { owner: { id: session.user.id } } })
  return NextResponse.json({ allLinks }, { status: 200 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { short_url } = await req.json()
  await prisma.link.delete({ where: { shortUrl: short_url, owner: { id: session.user.id } } })
  return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 })
}

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { oldSlug, newSlug } = await req.json();

  if (!newSlug || newSlug.length < 3) {
    return NextResponse.json(
      { error: "Invalid slug" },
      { status: 400 }
    );
  }

  const existing = await prisma.link.findUnique({
    where: {
      shortUrl: newSlug,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Slug already taken" },
      { status: 409 }
    );
  }

  const updated = await prisma.link.updateMany({
    where: {
      shortUrl: oldSlug,
      owner: {
        id: session.user.id,
      },
    },
    data: {
      shortUrl: newSlug,
    },
  });

  return NextResponse.json(updated);
}