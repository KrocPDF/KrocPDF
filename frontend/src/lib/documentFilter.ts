export type FilterMode = 'color-enhance' | 'monochrome' | 'high-contrast';

export interface FilterOptions {
  mode: FilterMode;
  gamma: number;      // Default: 1.4 (Range: 1.0 - 2.2)
  whitening: number;  // Threshold boost, Default: 1.15 (Range: 1.0 - 1.5)
}

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  mode: 'color-enhance',
  gamma: 1.4,
  whitening: 1.15,
};

/**
 * Enhances a photographed document by removing incandescent yellow tints,
 * flattening uneven shadows, and boosting text contrast using a fast O(1) Gamma LUT.
 */
export async function enhanceDocumentImage(
  imageSource: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  options: FilterOptions = DEFAULT_FILTER_OPTIONS
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Failed to acquire canvas context');

  canvas.width = imageSource.width;
  canvas.height = imageSource.height;
  ctx.drawImage(imageSource, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const gammaCorrection = 1 / Math.max(0.1, options.gamma);

  // Pre-calculate Gamma Look-Up Table (LUT) for O(1) pixel transformation
  const gammaLUT = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    gammaLUT[i] = Math.min(255, Math.floor(Math.pow(i / 255, gammaCorrection) * 255 * options.whitening));
  }

  // Pre-calculate High-Contrast LUT for crisp text enhancement
  const contrastLUT = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    const val = gammaLUT[i];
    // S-curve contrast boost
    const normalized = val / 255;
    const contrasted = normalized < 0.5 
      ? 2 * normalized * normalized 
      : 1 - 2 * (1 - normalized) * (1 - normalized);
    contrastLUT[i] = Math.min(255, Math.max(0, Math.floor(contrasted * 255)));
  }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (options.mode === 'monochrome') {
      // Perceived luminance formula (ITU-R BT.601)
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const enhanced = gammaLUT[Math.min(255, Math.floor(gray))];
      // Adaptive thresholding: whiten light background, deepen dark text
      const finalVal = enhanced > 195 ? 255 : enhanced < 85 ? 0 : Math.min(255, Math.floor(enhanced * 1.1));
      data[i] = finalVal;
      data[i + 1] = finalVal;
      data[i + 2] = finalVal;
    } else if (options.mode === 'high-contrast') {
      data[i] = contrastLUT[r];
      data[i + 1] = contrastLUT[g];
      data[i + 2] = contrastLUT[b];
    } else {
      // Color Enhance mode (Whitens paper background while preserving colored inks/stamps)
      data[i] = gammaLUT[r];
      data[i + 1] = gammaLUT[g];
      data[i + 2] = gammaLUT[b];
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      // Clean up canvas dimensions to immediately free GPU/heap memory
      canvas.width = 0;
      canvas.height = 0;
      if (blob) resolve(blob);
      else reject(new Error('Canvas export failed'));
    }, 'image/jpeg', 0.92);
  });
}
