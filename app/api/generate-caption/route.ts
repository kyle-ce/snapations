import { NextRequest } from "next/server";
import { generateCaptionFromImage } from "@/lib/caption";
import { generateMeme } from "@/lib/utils";

export async function POST(request: NextRequest) {
  // const {supabse, user, error} = getAuthenticatedUser() ;
  const formData = await request.formData();
  const file = formData.get("image") as File;
  const manualCaption = formData.get("caption") as string | null;

  if (!file) {
    return new Response(JSON.stringify({ error: "No image provided" }), {
      status: 400,
    });
  }

  // If manual caption is provided, use it; otherwise use AI to generate
  const caption = manualCaption?.trim()
    ? manualCaption
    : await generateCaptionFromImage(file);
  const buffer = Buffer.from(await file.arrayBuffer());
  const memeBuffer = await generateMeme(buffer, caption);
  return new Response(
    JSON.stringify({
      caption,
      meme: memeBuffer.toString("base64"),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
