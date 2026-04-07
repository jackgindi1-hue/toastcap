/**
 * Client-side image compression utility
 * Compresses images over 5MB to reduce upload times and server load
 */

const MAX_SIZE_BEFORE_COMPRESSION = 5 * 1024 * 1024; // 5MB
const TARGET_SIZE = 2 * 1024 * 1024; // Target: 2MB after compression
const MAX_DIMENSION = 2400; // Max width/height

/**
 * Check if a file is an image
 */
export function isImage(file: File): boolean {
  return file.type.startsWith('image/') && !file.type.includes('heic') && !file.type.includes('heif');
}

/**
 * Check if a file needs compression
 */
export function needsCompression(file: File): boolean {
  return isImage(file) && file.size > MAX_SIZE_BEFORE_COMPRESSION;
}

/**
 * Compress an image file using canvas
 * Returns the compressed file or the original if compression fails
 */
export async function compressImage(file: File): Promise<File> {
  // Don't compress non-images or small files
  if (!needsCompression(file)) {
    return file;
  }

  console.log(`🗜️ Compressing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

  try {
    // Create image element
    const img = await createImageFromFile(file);

    // Calculate new dimensions (maintain aspect ratio)
    let { width, height } = img;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_DIMENSION) / width);
        width = MAX_DIMENSION;
      } else {
        width = Math.round((width * MAX_DIMENSION) / height);
        height = MAX_DIMENSION;
      }
    }

    // Create canvas and draw resized image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Use high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    // Calculate quality based on target size
    let quality = 0.85;
    let blob = await canvasToBlob(canvas, file.type, quality);

    // Iteratively reduce quality if still too large
    while (blob.size > TARGET_SIZE && quality > 0.4) {
      quality -= 0.1;
      blob = await canvasToBlob(canvas, file.type, quality);
    }

    // Create new file with same name
    const compressedFile = new File([blob], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });

    const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
    console.log(`✅ Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB (${compressionRatio}% reduction)`);

    return compressedFile;
  } catch (error) {
    console.error('❌ Compression failed, using original:', error);
    return file;
  }
}

/**
 * Create an image element from a file
 */
function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      type === 'image/png' ? 'image/png' : 'image/jpeg',
      quality
    );
  });
}

/**
 * Compress multiple files (images only)
 */
export async function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressImage));
}
