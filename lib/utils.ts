import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line + word + " ";
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }

  if (line) {
    lines.push(line.trim());
  }

  return lines;
}

export async function generateMeme(
  buffer: Buffer,
  caption: string
): Promise<Buffer> {
  const img = await loadImage(buffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  // Draw the original image
  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Text styling
  const maxWidth = img.width * 0.9;
  const fontSize = img.height / 15;
  const lineHeight = fontSize * 1.2;
  ctx.font = `${fontSize}px Impact`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const lines = wrapText(ctx, caption.toUpperCase(), maxWidth);

  // Calculate background height and Y position
  const verticalPadding = 20;
  const textBlockHeight = lines.length * lineHeight + verticalPadding * 2;
  const textY = img.height * 0.75 - textBlockHeight / 2;

  // Draw black background bar
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, textY, img.width, textBlockHeight);

  // Draw caption lines (white fill + black stroke)
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;

  lines.forEach((line, index) => {
    const y = textY + verticalPadding + index * lineHeight;
    ctx.strokeText(line, img.width / 2, y);
    ctx.fillText(line, img.width / 2, y);
  });

  return canvas.toBuffer("image/png");
}
