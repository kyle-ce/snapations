import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCaptionFromImage(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a meme caption generator. Create short, witty captions that are funny and relatable. Keep them under 10 words, no emojis or hashtags.",
        },
        {
          role: "user",
          content: `I have an image. Please write a short, funny meme-style caption that would work well with it. Make it generic but humorous. Here's a hint about the image: ${base64.slice(
            0,
            50
          )}... [truncated]`,
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
