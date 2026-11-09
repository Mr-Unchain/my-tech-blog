import { test, expect } from '@playwright/test';

for (const { width, tocSelector } of [
  { width: 1280, tocSelector: '.editorial-article__toc-desktop' },
  { width: 390, tocSelector: '.editorial-article__toc-mobile' },
]) {
  test(`t focuses the visible article TOC at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/blog/docker-intro-part1/');

    await page.keyboard.press('t');

    const toc = page.locator(tocSelector);
    await expect(toc.locator('a').first()).toBeFocused();
    await expect(toc.locator('a').first()).toBeVisible();
    if (width === 390) await expect(toc).toHaveAttribute('open', '');
  });
}
