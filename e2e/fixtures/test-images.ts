/**
 * Synthetic image fixtures for KrocPDF end-to-end tests.
 * Includes minimal valid byte streams for PNG, JPEG, and WebP formats.
 */

// Minimal valid 1x1 red PNG byte stream
export const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// Minimal valid 1x1 JPEG byte stream
export const TINY_JPEG_BASE64 =
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

// Minimal valid 1x1 WebP byte stream
export const TINY_WEBP_BASE64 =
  'UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';

export interface SyntheticFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export function getSyntheticPng(name = 'sample-document.png'): SyntheticFile {
  return {
    name,
    mimeType: 'image/png',
    buffer: Buffer.from(TINY_PNG_BASE64, 'base64'),
  };
}

export function getSyntheticJpeg(name = 'sample-receipt.jpg'): SyntheticFile {
  return {
    name,
    mimeType: 'image/jpeg',
    buffer: Buffer.from(TINY_JPEG_BASE64, 'base64'),
  };
}

export function getSyntheticWebp(name = 'sample-photo.webp'): SyntheticFile {
  return {
    name,
    mimeType: 'image/webp',
    buffer: Buffer.from(TINY_WEBP_BASE64, 'base64'),
  };
}

