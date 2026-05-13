import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const links = await prisma.link.findMany()
    const totalLinks = links.length
    const totalClicks = links.reduce((acc, link) => acc + link.clicks, 0)
    return NextResponse.json({ totalLinks, totalClicks }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}