import { test, expect } from '@playwright/test';

test('app loads and toggles preview', async ({ page }) => {
  await page.goto('/');

  // Verify Edit mode is active by checking for Quiz Details section
  await expect(
    page.getByRole('heading', { name: 'Quiz Details' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /edit/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  // Toggle to Preview mode
  await page.getByRole('button', { name: /preview/i }).click();

  // Verify Preview mode is active
  await expect(page.getByRole('button', { name: /preview/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByText('No questions in this quiz yet')).toBeVisible();
});
