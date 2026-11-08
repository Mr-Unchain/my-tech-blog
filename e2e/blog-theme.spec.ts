import { test, expect } from '@playwright/test';

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  for (const initialTheme of ['light', 'dark'] as const) {
    test(`blog hero respects ${initialTheme} theme at ${viewport.width}px`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: initialTheme });
      await page.addInitScript((theme) => {
        // Initialize once so a reload also checks persistence after toggling.
        if (!localStorage.getItem('theme'))
          localStorage.setItem('theme', theme);
      }, initialTheme);
      const response = await page.goto('/blog/');
      expect(response?.status()).toBe(200);
      const hero = page.locator('section').filter({
        has: page.getByRole('heading', {
          name: 'Blog Articles',
          exact: true,
        }),
      });
      const overlay = hero.locator(':scope > div[aria-hidden="true"]');
      const toggle = page.locator('[data-testid="theme-toggle-button"]:visible');

      const checkTheme = async (theme: 'light' | 'dark') => {
        await expect(page.locator('html')).toHaveClass(
          theme === 'dark' ? /\bdark\b/ : /^(?!.*\bdark\b)/
        );
        await expect(overlay).toHaveCSS(
          'display',
          theme === 'dark' ? 'block' : 'none'
        );
        await expect(hero).toHaveCSS(
          'background-image',
          theme === 'dark'
            ? 'linear-gradient(rgb(30, 41, 59), rgb(15, 23, 42), rgb(15, 23, 42))'
            : 'linear-gradient(rgb(248, 250, 252), rgb(255, 255, 255), rgb(255, 255, 255))'
        );
      };

      await checkTheme(initialTheme);
      await hero.screenshot({ path: testInfo.outputPath('hero.png') });
      await expect(toggle).toBeEnabled();
      await toggle.click();
      const nextTheme = initialTheme === 'light' ? 'dark' : 'light';
      await checkTheme(nextTheme);
      await page.reload();
      await checkTheme(nextTheme);
    });
  }
}
