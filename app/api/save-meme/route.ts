import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function POST(req: NextRequest) {
  const { user, supabase } = await getAuthenticatedUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const caption = formData.get("caption") as string;

  if (!caption || !file) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  const fileExt = file.type.split("/")[1];
  const fileName = `${user.id}/meme-${Date.now()}.${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("memes")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error(uploadError);
    return new Response(JSON.stringify({ error: uploadError.message }), {
      status: 500,
    });
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("memes")
    .getPublicUrl(fileName);

  const publicUrl = publicUrlData?.publicUrl;

  if (!publicUrl) {
    return new Response(JSON.stringify({ error: "Failed to get public URL" }), {
      status: 500,
    });
  }

  try {
    const saved = await prisma.memes.create({
      data: {
        caption,
        imageUrl: publicUrl,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify(saved), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
