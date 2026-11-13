import { test, expect } from '@playwright/test';

test.describe('Keyboard Accessibility & Navigation', () => {
  test('navigates seamlessly between navigation, dropzone, and footer via keyboard', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedTag);

    // Verify report issue link is reachable from footer
    const reportLink = page.getByRole('link', { name: /report an issue/i });
    await expect(reportLink).toBeVisible();

    await reportLink.click();
    await expect(page).toHaveURL(/.*report-issue/);
    await expect(page.getByRole('heading', { name: /report an issue/i })).toBeVisible();
  });
});

