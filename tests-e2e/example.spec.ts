import { test, expect } from '@playwright/test';

test('app loads and toggles preview', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('Edit mode placeholder', { exact: false }),
  ).toBeVisible();
  await page.getByRole('button', { name: /preview/i }).click();
  await expect(
    page.getByText('Preview mode placeholder', { exact: false }),
  ).toBeVisible();
});
