import { test, expect } from '@playwright/test';

test('home renders header and nav', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Monologger' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
});

