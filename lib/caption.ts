export function wrapText(
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

export async function generateMemeInBrowser(
  imageFile: File,
  caption: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;

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

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate meme"));
      }, "image/png");
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(imageFile);
  });
}
