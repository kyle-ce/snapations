import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCaptionFromImage(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;

    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Write a short, funny meme caption for this image. Keep it under 10 words, no emojis or hashtags.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 50,
      temperature: 0.8,
    });

    const caption = res.choices[0].message.content;
    if (!caption) throw new Error("No caption generated");
    return caption;
  } catch (error) {
    console.error("Caption generation error:", error);
    throw new Error(
      "Failed to generate caption. Please try again or write your own."
    );
  }
}
