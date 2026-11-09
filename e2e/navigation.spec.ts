import { test, expect } from '@playwright/test';

test('can navigate to search page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: '検索ページへ移動' }).click();

  await expect(page).toHaveURL(/\/search/);
  await expect(page.getByRole('heading', { name: '記事を探す' })).toBeVisible();
});

test('can open an article and its comment controls from home', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: '記事を読む' }).click();

  await expect(page).toHaveURL(/\/blog\/docker-intro-part1\/$/);
  await expect(page.getByRole('heading', { name: 'ディスカッション' })).toBeVisible();
  await expect(page.getByText('うまく表示されない場合')).toBeVisible();
});

