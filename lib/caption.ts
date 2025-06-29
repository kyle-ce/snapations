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

      // Calculate base font size based on image dimensions
      const imageArea = img.width * img.height;
      const shortestSide = Math.min(img.width, img.height);
      const longestSide = Math.max(img.width, img.height);
      const aspectRatio = longestSide / shortestSide;
  
      // Base size calculation that considers both dimensions and aspect ratio
      const baseSize = Math.sqrt(imageArea) / 25; // Scales with total image area
      const aspectRatioAdjustment = Math.pow(aspectRatio, 0.3); // Subtle adjustment for extreme ratios
      const baseFontSize = Math.min(baseSize / aspectRatioAdjustment, 120); // Cap at 120px
  
      // Apply user-selected size modifier with larger scale differences
      const fontSizeMultiplier =
        fontSize === "small" ? 1.0 : fontSize === "large" ? 2.0 : 1.5;
      const actualFontSize = baseFontSize * fontSizeMultiplier;
  
      // Text width constraint
      const maxWidth = img.width * 0.9;
      const lineHeight = Math.round(actualFontSize * 1.3); // More spacing between lines
      ctx.font = `bold ${actualFontSize}px Impact, "Arial Black"`; // Classic meme font
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.strokeStyle = "black";
      ctx.fillStyle = "white";
      
      // Thicker outline for meme style
      ctx.lineWidth = Math.max(4, actualFontSize / 15);
      ctx.lineJoin = "round"; // Smooth corners
      ctx.miterLimit = 2;

      // Split text into lines that fit within maxWidth
      const words = caption.toUpperCase().split(" ");
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);

      // Calculate total height of text block
      const totalHeight = lines.length * lineHeight;
      let y = (img.height - totalHeight) / 2; // Center text vertically

      // Draw each line with enhanced outline
      lines.forEach((line) => {
        // Multiple outline passes for thickness
        const outlinePasses = [
          { x: -1, y: -1 }, { x: 1, y: -1 },
          { x: -1, y: 1 }, { x: 1, y: 1 },
          { x: -2, y: 0 }, { x: 2, y: 0 },
          { x: 0, y: -2 }, { x: 0, y: 2 }
        ];

        // Draw multiple outline passes
        outlinePasses.forEach(({x, y: offsetY}) => {
          ctx.strokeText(line, img.width / 2 + x, y + offsetY);
        });

        // Main outline
        ctx.strokeText(line, img.width / 2, y);
        
        // White fill
        ctx.fillText(line, img.width / 2, y);
        y += lineHeight;
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
