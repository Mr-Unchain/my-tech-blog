import { test, expect } from '@playwright/test';

test('can navigate to search page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: '検索ページへ移動' }).click();

  await expect(page).toHaveURL(/\/search/);
  await expect(page.getByRole('heading', { name: /検索/ })).toBeVisible();
});

