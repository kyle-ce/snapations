import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { memeId } = await request.json();
    if (!memeId) {
      return new Response(JSON.stringify({ error: "Meme ID is required" }), {
        status: 400,
      });
    }

    // Verify the meme belongs to the user
    const meme = await prisma.memes.findUnique({
      where: { id: memeId },
    });

    if (!meme) {
      return new Response(JSON.stringify({ error: "Meme not found" }), {
        status: 404,
      });
    }

    if (meme.userId !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }

    // Delete the meme
    await prisma.memes.delete({
      where: { id: memeId },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting meme:", error);
    return new Response(JSON.stringify({ error: "Failed to delete meme" }), {
      status: 500,
    });
  }
}
