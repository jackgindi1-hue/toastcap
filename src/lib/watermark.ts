// Watermark utility for adding watermark to uploaded files
// Supports both images (jpg, png, etc.) and PDFs

// ============================================
// TOAST CAPITAL CONFIGURATION
// ============================================
const WATERMARK_TEXT = 'TOAST CAPITAL';
const WATERMARK_COLOR = { r: 1, g: 0.42, b: 0.21 }; // Toast Orange (#FF6B35)
const WATERMARK_OPACITY = 0.20;
// ============================================

function isImage(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.bmp'];
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return imageExtensions.includes(ext);
}

function isPDF(filename: string): boolean {
  return filename.toLowerCase().endsWith('.pdf');
}

async function addWatermarkToImage(buffer: Buffer, filename: string): Promise<{ buffer: Buffer; success: boolean }> {
  console.log(`🖼️ [WATERMARK] Starting image watermark for: ${filename}`);
  try {
    // Dynamic import of sharp
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default;

    const image = sharp(buffer);
    const metadata = await image.metadata();

    const width = metadata.width || 800;
    const height = metadata.height || 600;
    const fontSize = Math.max(Math.min(width, height) / 12, 30);

    // Create SVG with repeated watermark pattern
    const svgWatermark = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="watermarkPattern" width="${fontSize * 14}" height="${fontSize * 5}" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
            <text x="10" y="${fontSize * 1.2}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" fill="rgba(255, 107, 53, 0.35)" font-weight="bold">
              ${WATERMARK_TEXT}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#watermarkPattern)" />
      </svg>
    `;

    const watermarkedBuffer = await image
      .composite([
        {
          input: Buffer.from(svgWatermark),
          gravity: 'center',
        },
      ])
      .toBuffer();

    console.log(`✅ [WATERMARK] Image watermarked: ${filename}`);
    return { buffer: watermarkedBuffer, success: true };
  } catch (error: any) {
    console.error(`❌ [WATERMARK] Failed to watermark image ${filename}: ${error?.message}`);
    return { buffer, success: false };
  }
}

async function addWatermarkToPDF(buffer: Buffer, filename: string): Promise<{ buffer: Buffer; success: boolean }> {
  console.log(`📄 [WATERMARK] Starting PDF watermark for: ${filename}`);
  try {
    const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');

    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(buffer, {
        ignoreEncryption: true,
        updateMetadata: false
      });
    } catch (loadError: any) {
      console.log(`🔒 [WATERMARK] PDF is encrypted/protected: ${filename}`);
      return { buffer, success: false };
    }

    const pages = pdfDoc.getPages();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = Math.max(Math.min(width, height) / 18, 24);
      const textWidth = helveticaBold.widthOfTextAtSize(WATERMARK_TEXT, fontSize);
      const spacing = textWidth * 1.8;

      // Draw watermarks diagonally across the page
      for (let y = -height; y < height * 2; y += spacing * 0.5) {
        for (let x = -width; x < width * 2; x += spacing) {
          page.drawText(WATERMARK_TEXT, {
            x: x,
            y: y,
            size: fontSize,
            font: helveticaBold,
            color: rgb(WATERMARK_COLOR.r, WATERMARK_COLOR.g, WATERMARK_COLOR.b),
            opacity: WATERMARK_OPACITY,
            rotate: degrees(-35),
          });
        }
      }
    }

    const watermarkedPdfBytes = await pdfDoc.save();
    console.log(`✅ [WATERMARK] PDF watermarked: ${filename}`);
    return { buffer: Buffer.from(watermarkedPdfBytes), success: true };
  } catch (error: any) {
    console.error(`❌ [WATERMARK] Failed to watermark PDF ${filename}: ${error?.message}`);
    return { buffer, success: false };
  }
}

/**
 * Process a buffer and add watermark
 * @param buffer - The file buffer to watermark
 * @param filename - The filename (used to determine file type)
 * @returns { buffer, watermarked } - watermarked is true if successful
 */
export async function processBufferWithWatermark(
  buffer: Buffer,
  filename: string
): Promise<{ buffer: Buffer; watermarked: boolean }> {
  console.log(`🔍 [WATERMARK] Processing: ${filename} (${buffer.length} bytes)`);

  if (isImage(filename)) {
    const { buffer: watermarkedBuffer, success } = await addWatermarkToImage(buffer, filename);
    return { buffer: watermarkedBuffer, watermarked: success };
  } else if (isPDF(filename)) {
    const { buffer: watermarkedBuffer, success } = await addWatermarkToPDF(buffer, filename);
    return { buffer: watermarkedBuffer, watermarked: success };
  } else {
    console.log(`📁 [WATERMARK] Unknown file type: ${filename}`);
    return { buffer, watermarked: false };
  }
}
