export interface SeoConfig {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  toolSchemaName: string;
}

export interface ToolCardConfig {
  slug: string;
  name: string;
  shortDescription: string;
  iconId: 'image' | 'image-plus' | 'camera' | 'merge' | 'minimize' | 'file-output';
  accentFrom: string;
  accentTo: string;
  comingSoon: boolean;
  comingSoonBlurb?: string;
}

const seoConfigs: Record<string, SeoConfig> = {
  'jpg-to-pdf': {
    title: 'Convert JPG to PDF Online | Free & Secure | KrocPDF',
    description: 'Convert your JPG images to PDF documents instantly. 100% secure, local in-browser conversion or blazing fast cloud servers.',
    h1: 'JPG to PDF',
    subtitle: 'Secure, client-side direct uploads. Instant document compilation.',
    toolSchemaName: 'JPG to PDF Converter'
  },
  'png-to-pdf': {
    title: 'Convert PNG to PDF Online | Free & Secure | KrocPDF',
    description: 'Convert your PNG transparent images to PDF documents instantly. 100% secure, local in-browser conversion.',
    h1: 'PNG to PDF',
    subtitle: 'Preserve transparency and crisp quality. Secure PNG conversion.',
    toolSchemaName: 'PNG to PDF Converter'
  },
  'jpeg-to-pdf': {
    title: 'Convert JPEG to PDF Online | Free & Secure | KrocPDF',
    description: 'Convert your JPEG photos to PDF documents instantly. High quality, no watermark.',
    h1: 'JPEG to PDF',
    subtitle: 'High quality JPEG conversion. No limits, no watermarks.',
    toolSchemaName: 'JPEG to PDF Converter'
  },
  'merge-pdf': {
    title: 'Merge PDF Files Online | Free & Secure | KrocPDF',
    description: 'Combine multiple PDF documents into a single file instantly. 100% secure, local in-browser merging or high-capacity cloud batching.',
    h1: 'Merge PDF',
    subtitle: 'Combine multiple PDFs into one document easily and securely.',
    toolSchemaName: 'Merge PDF Tool'
  },
  'compress-pdf': {
    title: 'Compress PDF Online | Free & Secure | KrocPDF',
    description: 'Reduce PDF file size without losing quality. Secure cloud processing.',
    h1: 'Compress PDF',
    subtitle: 'Reduce file sizes quickly with intelligent compression.',
    toolSchemaName: 'Compress PDF Tool'
  },
  'pdf-to-jpg': {
    title: 'Convert PDF to JPG Online | Free & Secure | KrocPDF',
    description: 'Extract pages from your PDF documents as high-quality JPG images.',
    h1: 'PDF to JPG',
    subtitle: 'Convert PDF pages to JPG images securely and instantly.',
    toolSchemaName: 'PDF to JPG Converter'
  }
};

export const toolCards: ToolCardConfig[] = [
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    shortDescription: 'Convert JPG images to PDF documents instantly.',
    iconId: 'image',
    accentFrom: '#e4e4e7',
    accentTo: '#71717a',
    comingSoon: false,
  },
  {
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    shortDescription: 'Preserve transparency. Convert PNG to PDF.',
    iconId: 'image-plus',
    accentFrom: '#f4f4f5',
    accentTo: '#a1a1aa',
    comingSoon: false,
  },
  {
    slug: 'jpeg-to-pdf',
    name: 'JPEG to PDF',
    shortDescription: 'High quality JPEG to PDF. No watermarks.',
    iconId: 'camera',
    accentFrom: '#e4e4e7',
    accentTo: '#71717a',
    comingSoon: false,
  },
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDFs into a single document.',
    iconId: 'merge',
    accentFrom: '#d4d4d8',
    accentTo: '#52525b',
    comingSoon: false,
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    shortDescription: 'Reduce PDF file size without losing quality.',
    iconId: 'minimize',
    accentFrom: '#f4f4f5',
    accentTo: '#a1a1aa',
    comingSoon: false,
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    shortDescription: 'Extract pages from PDF as JPG images.',
    iconId: 'file-output',
    accentFrom: '#e4e4e7',
    accentTo: '#71717a',
    comingSoon: false,
  },
];

export const getSeoConfig = (tool: string): SeoConfig => {
  return seoConfigs[tool] || seoConfigs['jpg-to-pdf'];
};

export const getActiveTools = (): ToolCardConfig[] => {
  return toolCards.filter(t => !t.comingSoon);
};

export const getSiblingTools = (currentSlug: string): ToolCardConfig[] => {
  return toolCards.filter(t => !t.comingSoon && t.slug !== currentSlug);
};
