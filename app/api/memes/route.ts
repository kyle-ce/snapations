import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const limit = searchParams.get("limit");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const memes = await prisma.memes.findMany({
    where: { userId },
    take: limit ? parseInt(limit) : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(memes);
}
