# KrocPDF Sample Test Images

This directory contains standardized, public-domain test images for local verification, benchmarking, and demo testing.

## File Manifest

| File | Format | Dimensions | Purpose |
|:---|:---:|:---:|:---|
| **`sample-receipt.jpg`** | JPEG | 1200 × 1600 | High-contrast receipt scan for testing EXIF orientation and small font legibility. |
| **`sample-document.png`** | PNG | 2480 × 3508 | Standard A4 300 DPI legal letterhead for testing lossless PNG conversion. |
| **`sample-photo.webp`** | WebP | 1920 × 1080 | Modern landscape photo for testing multi-format decoding. |

## Generating Test Images via Script
You can generate synthetic pixel-perfect test images for automated suites using the fixtures helper:
```typescript
import { getSyntheticPng, getSyntheticJpeg } from '../e2e/fixtures/test-images';

const receipt = getSyntheticJpeg('test-receipt.jpg');
```

