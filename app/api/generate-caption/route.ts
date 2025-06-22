import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCaptionFromImage } from "@/lib/caption";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function POST(request: NextRequest) {
  // const {supabse, user, error} = getAuthenticatedUser() ;
  const formData = await request.formData();
  const file = formData.get("image") as File;
  if (!file) {
    return new Response(JSON.stringify({ error: "No image provided" }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExt = file.type.split("/")[1];
  const fileName = `meme-${Date.now()}.${fileExt}`;

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/memes/${fileName}`;

  //   const caption = await generateCaptionFromImage(file);
  const caption = "temp";

  //   if (user) {
  //     await prisma.caption.create({
  //       data: {
  //         caption,
  //         imageUrl: publicUrl,
  //         user: { connect: { email: user.email! } },
  //       },
  //     });
  //   }

  return new Response(JSON.stringify({ caption, imageUrl: publicUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
