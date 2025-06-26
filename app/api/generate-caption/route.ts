import { NextRequest } from "next/server";
import { generateCaptionFromImage } from "@/lib/caption";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "No image provided" }), {
      status: 400,
    });
  }

  // Generate caption using AI
  const caption = await generateCaptionFromImage(file);
  
  return new Response(
    JSON.stringify({ caption }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
