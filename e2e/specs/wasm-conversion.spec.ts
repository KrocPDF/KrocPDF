import { test, expect } from '@playwright/test';
import { getSyntheticPng, getSyntheticJpeg } from '../fixtures/test-images';

test.describe('Client-Side WASM Conversion Engine', () => {
  test('converts multiple images locally without sending payload over network', async ({ page }) => {
    // 1. Intercept network requests to guarantee 0-byte upload privacy
    let externalPayloadUploaded = false;
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/api/convert') || url.includes('/api/jobs') || url.includes('/conversions')) {
        if (request.method() === 'POST' || request.method() === 'PUT') {
          externalPayloadUploaded = true;
        }
      }
    });

    // 2. Navigate to JPG to PDF tool page
    await page.goto('/jpg-to-pdf');
    await expect(page).toHaveTitle(/KrocPDF|JPG to PDF/i);

    // 3. Locate file input inside the upload dropzone
    const fileChooserInput = page.locator('input[type="file"]');
    await expect(fileChooserInput).toBeAttached();

    // 4. Attach synthetic test images
    const sample1 = getSyntheticJpeg('receipt-1.jpg');
    const sample2 = getSyntheticPng('scan-2.png');

    await fileChooserInput.setInputFiles([
      { name: sample1.name, mimeType: sample1.mimeType, buffer: sample1.buffer },
      { name: sample2.name, mimeType: sample2.mimeType, buffer: sample2.buffer },
    ]);

    // 5. Verify thumbnail preview cards are rendered in UI
    const thumbnailCards = page.locator('[data-rbd-draggable-id], [data-testid="image-card"], .group');
    await expect(thumbnailCards.first()).toBeVisible({ timeout: 10000 });

    // 6. Click Convert to PDF button
    const convertButton = page.getByRole('button', { name: /convert to pdf/i });
    await expect(convertButton).toBeEnabled();
    await convertButton.click();

    // 7. Verify conversion completes and download button is presented
    const downloadButton = page.getByRole('link', { name: /download pdf/i }).or(
      page.getByRole('button', { name: /download/i })
    );
    await expect(downloadButton).toBeVisible({ timeout: 15000 });

    // 8. Assert zero external payload was uploaded (Privacy Guarantee)
    expect(externalPayloadUploaded).toBe(false);
  });
});

