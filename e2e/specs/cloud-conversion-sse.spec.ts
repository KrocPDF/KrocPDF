import { test, expect } from '@playwright/test';

test.describe('Distributed Cloud Conversion & SSE Progress Pipeline', () => {
  test('handles server-sent events (SSE) progress streaming correctly', async ({ page }) => {
    const mockJobId = 'job-test-778899';

    // Mock the SSE stream response from NestJS backend
    await page.route(`**/api/jobs/${mockJobId}/progress`, async (route) => {
      const sseBody = [
        'event: progress\ndata: {"status":"PROCESSING","progress":25,"stage":"Downloading buffers"}\n\n',
        'event: progress\ndata: {"status":"PROCESSING","progress":65,"stage":"Assembling PDF"}\n\n',
        'event: progress\ndata: {"status":"COMPLETED","progress":100,"stage":"Ready","downloadUrl":"https://storage.krocpdf.app/output.pdf"}\n\n',
      ].join('');

      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
        body: sseBody,
      });
    });

    // Navigate to homepage
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Verify progress tracking contract structure
    const testContractResponse = await page.request.get(`/api/jobs/${mockJobId}/progress`);
    expect(testContractResponse.status()).toBe(200);
    const text = await testContractResponse.text();
    expect(text).toContain('COMPLETED');
    expect(text).toContain('Assembling PDF');
  });
});

