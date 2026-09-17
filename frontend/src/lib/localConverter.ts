import { PDFDocument, PageSizes } from 'pdf-lib';
import { enhanceDocumentImage, FilterOptions, DEFAULT_FILTER_OPTIONS } from './documentFilter';

export interface LayoutSettings {
  pageSize: string;
  orientation: string;
  margins: string;
  dpi: number;
  transparencyMode?: string;
  documentScannerMode?: boolean;
  filterOptions?: FilterOptions;
  perImageOptions?: Record<string, FilterOptions>;
}

const PAGE_DIMENSIONS: Record<string, [number, number]> = {
  A4: PageSizes.A4,
  LETTER: PageSizes.Letter,
  LEGAL: [612, 1008], // Legal size in points
};

const getScaleFromMargins = (margins: string): number => {
  switch (margins) {
    case 'SMALL': return 0.95;
    case 'MEDIUM': return 0.90;
    case 'LARGE': return 0.80;
    default: return 1.0;
  }
};

export async function generateLocalPdf(
  files: File[],
  settings: LayoutSettings,
  onProgress: (percent: number) => void
): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Create image element to draw on canvas
    const imageUrl = URL.createObjectURL(file);
    let htmlImage: HTMLImageElement | null = new Image();
    await new Promise((resolve, reject) => {
      if (!htmlImage) return reject();
      htmlImage.onload = resolve;
      htmlImage.onerror = reject;
      htmlImage.src = imageUrl;
    });

    // Device-Aware Memory Fallback
    const isMobile = window.innerWidth <= 1024 || (navigator.maxTouchPoints || 0) > 0;
    // @ts-expect-error - deviceMemory is non-standard
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 8;
    const maxDimension = (isMobile || isLowMemory) ? 2000 : 4000;

    if (htmlImage.width > maxDimension || htmlImage.height > maxDimension) {
      URL.revokeObjectURL(imageUrl);
      htmlImage = null;
      throw new Error('MEMORY_FALLBACK');
    }

    let bytes: Uint8Array;
    let isEnhancedJpeg = false;

    const specificOptions = settings.perImageOptions?.[file.name];
    const shouldEnhance = Boolean(specificOptions || settings.documentScannerMode);

    if (shouldEnhance) {
      const filterOpts = specificOptions || settings.filterOptions || DEFAULT_FILTER_OPTIONS;
      const enhancedBlob = await enhanceDocumentImage(htmlImage, filterOpts);
      const arrayBuffer = await enhancedBlob.arrayBuffer();
      bytes = new Uint8Array(arrayBuffer);
      isEnhancedJpeg = true;
    } else if (file.type === 'image/png' && settings.transparencyMode === 'keep_transparent') {
      // Direct passthrough for keeping transparency to avoid canvas pre-multiplied alpha issues
      const buffer = await file.arrayBuffer();
      bytes = new Uint8Array(buffer);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = htmlImage.width;
      canvas.height = htmlImage.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        if (settings.transparencyMode === 'flatten_black') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // Default to flatten_white
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(htmlImage, 0, 0);
      }

      // Use native toBlob for memory efficiency instead of DataURL string parsing
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, file.type === 'image/png' ? 'image/png' : 'image/jpeg', 1.0);
      });
      
      if (!blob) throw new Error('Canvas toBlob failed');
      const arrayBuffer = await blob.arrayBuffer();
      bytes = new Uint8Array(arrayBuffer);

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.width = 0;
      canvas.height = 0;
    }

    let image;
    if (isEnhancedJpeg || file.type === 'image/jpeg') {
      image = await pdfDoc.embedJpg(bytes);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(bytes);
    } else {
      // Explicit cleanup before continue
      URL.revokeObjectURL(imageUrl);
      htmlImage = null;
      continue;
    }
    
    let [pageWidth, pageHeight] = PAGE_DIMENSIONS[settings.pageSize] || PageSizes.A4;
    
    if (settings.pageSize === 'FIT_TO_IMAGE') {
      pageWidth = image.width;
      pageHeight = image.height;
    } else if (settings.pageSize === 'CUSTOM') {
      pageWidth = PageSizes.A4[0];
      pageHeight = PageSizes.A4[1];
    }

    if (settings.pageSize !== 'FIT_TO_IMAGE') {
      if (settings.orientation === 'LANDSCAPE') {
        [pageWidth, pageHeight] = [Math.max(pageWidth, pageHeight), Math.min(pageWidth, pageHeight)];
      } else if (settings.orientation === 'PORTRAIT') {
        [pageWidth, pageHeight] = [Math.min(pageWidth, pageHeight), Math.max(pageWidth, pageHeight)];
      } else if (settings.orientation === 'AUTO') {
        if (image.width > image.height) {
          [pageWidth, pageHeight] = [Math.max(pageWidth, pageHeight), Math.min(pageWidth, pageHeight)];
        } else {
          [pageWidth, pageHeight] = [Math.min(pageWidth, pageHeight), Math.max(pageWidth, pageHeight)];
        }
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    
    const scale = getScaleFromMargins(settings.margins);
    
    // Calculate dimensions to fit within the page while maintaining aspect ratio
    const imgDims = image.scale(1);
    const widthRatio = (pageWidth * scale) / imgDims.width;
    const heightRatio = (pageHeight * scale) / imgDims.height;
    const bestRatio = Math.min(widthRatio, heightRatio);
    
    const finalWidth = imgDims.width * bestRatio;
    const finalHeight = imgDims.height * bestRatio;
    
    // Center the image
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;
    
    page.drawImage(image, {
      x,
      y,
      width: finalWidth,
      height: finalHeight,
    });
    
    // Explicit Cleanup for memory bounding
    URL.revokeObjectURL(imageUrl);
    htmlImage = null;
    
    // Yield to GC
    await new Promise(r => setTimeout(r, 10));

    onProgress(Math.round(((i + 1) / files.length) * 100));
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

export async function mergePdfsLocally(
  files: File[],
  onProgress: (percent: number) => void
): Promise<string> {
  const mergedPdf = await PDFDocument.create();
  let progress = 10;
  onProgress(progress);
  
  const step = 80 / Math.max(1, files.length);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    
    // Copy all pages
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
    
    progress += step;
    onProgress(Math.round(progress));
  }

  onProgress(90);
  const mergedPdfBytes = await mergedPdf.save();
  onProgress(100);

  const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

export async function compressPdfLocally(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  onProgress(20);
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  onProgress(60);
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  onProgress(100);

  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}


export async function convertPdfToJpgLocally(
  file: File,
  settings: LayoutSettings & { imageQuality?: number },
  onProgress: (percent: number) => void
): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const { zipSync } = await import('fflate');

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  if (numPages > 30) {
    throw new Error('MEMORY_FALLBACK');
  }

  const quality = (settings.imageQuality || 80) / 100;
  // Use DPI setting to determine scale (150 DPI is approx scale 2.08 since standard is 72)
  const scale = (settings.dpi || 150) / 72;

  const filesToZip: Record<string, Uint8Array> = {};

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get 2D context');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      background: 'rgba(255,255,255,1)'
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render(renderContext as any).promise;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob) throw new Error('Canvas toBlob failed');
    const imgBuffer = await blob.arrayBuffer();
    filesToZip[`page_${pageNum}.jpg`] = new Uint8Array(imgBuffer);

    // CRITICAL: Strict canvas clearing and event loop yielding
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
    
    // Release page resources
    page.cleanup();

    await new Promise(r => setTimeout(r, 10)); // Yield

    onProgress(Math.round((pageNum / numPages) * 90)); // Leave 10% for zipping
  }

  // Zip the files entirely in memory using fflate
  const zipped = zipSync(filesToZip, { level: 0 }); // level 0 because JPEGs are already compressed
  onProgress(100);

  const zipBlob = new Blob([zipped], { type: 'application/zip' });
  return URL.createObjectURL(zipBlob);
}
