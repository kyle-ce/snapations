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
  caption: string,
  fontSize: "small" | "medium" | "large" = "medium"
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
      const baseFontSize = Math.min(img.height / 12, 72); // Base size that scales with image
      const fontSizeMultiplier =
        fontSize === "small" ? 0.8 : fontSize === "large" ? 1.2 : 1;
      const actualFontSize = baseFontSize * fontSizeMultiplier;
      const lineHeight = Math.round(actualFontSize * 1.3); // More spacing between lines
      ctx.font = `bold ${actualFontSize}px "Arial Black", Impact`; // Modern font stack
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const lines = wrapText(ctx, caption.toUpperCase(), maxWidth);

      // Calculate text position (centered vertically)
      const verticalPadding = 20;
      const textBlockHeight = lines.length * lineHeight + verticalPadding * 2;
      const textY = img.height * 0.75 - textBlockHeight / 2;

      // Enhanced text effects for better visibility without background
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = Math.max(6, fontSize / 8); // Thicker stroke for better contrast

      // Multiple shadow layers for better visibility
      const shadowOffsets = [
        { x: -2, y: -2 },
        { x: 2, y: -2 },
        { x: -2, y: 2 },
        { x: 2, y: 2 },
      ];

      lines.forEach((line, index) => {
        const y = textY + verticalPadding + index * lineHeight;

        // Draw multiple black shadows for better contrast
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        shadowOffsets.forEach((offset) => {
          ctx.shadowOffsetX = offset.x;
          ctx.shadowOffsetY = offset.y;
          ctx.strokeText(line, img.width / 2, y);
        });

        // Clear shadows for the main text
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw thick stroke
        ctx.strokeText(line, img.width / 2, y);
        // Draw white fill on top
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
