import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCaptionFromImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const res = await openai.chat.completions.create({
    model: "gpt-4o", // or "gpt-4-vision-preview"
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "write meme like caption for this image.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${file.type};base64,${base64}`,
            },
          },
        ],
      },
    ],
  });

  return res.choices[0].message.content ?? "No caption generated.";
}
