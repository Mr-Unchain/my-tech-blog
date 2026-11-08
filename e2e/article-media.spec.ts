import { test, expect } from '@playwright/test';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

test.use({
  channel: process.platform === 'win32' ? 'chrome' : undefined,
  video: 'off',
});
test.describe.configure({ mode: 'serial' });
const id = 'media-preview-verification-20261108';
const draftPath = path.resolve(`src/content/drafts/${id}.md`);
let createdDraft = false;

test.beforeAll(async () => {
  await mkdir(path.dirname(draftPath), { recursive: true });
  await writeFile(
    draftPath,
    `---\nid: ${id}\ntitle: Media preview verification\ndescription: Temporary browser verification\ncategory: [Test]\ndraft: true\n---\n\n![Local image](/images/articles/2-q1jo80jo8/fb6e07f3525599e2.png)\n\nhttps://open.spotify.com/track/0Lr4kGOYn9l83EjuK6cZFQ\n\nhttps://docs.astro.build/en/guides/markdown-content/\n\nThis [inline link](https://example.com) stays in the sentence.\n`,
    { flag: 'wx' }
  );
  createdDraft = true;
});
test.afterAll(async () => {
  if (createdDraft) await unlink(draftPath);
});

for (const [articleId, count] of [
  ['2-q1jo80jo8', 2],
  ['34bpznogsn', 5],
  ['ndfryc-w8ws', 4],
] as const) {
  test(`renders every local body image in ${articleId}`, async ({ page }) => {
    // Article images must remain usable even if the old CMS asset host is blocked.
    await page.route('https://images.microcms-assets.io/**', (route) =>
      route.abort()
    );
    await page.goto(`/blog/${articleId}/`);
    const images = page.locator(
      '.blog-article-content img:not(.preview-image)'
    );
    await expect(images).toHaveCount(count);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (node: HTMLImageElement) => node.complete && node.naturalWidth > 0
          )
        )
        .toBe(true);
      expect(await image.getAttribute('src')).not.toContain('microcms-assets');
    }
  });
}

test('renders Spotify embeds and website cards without converting inline links', async ({
  page,
}, testInfo) => {
  await page.goto(`/blog/${id}/`);
  const player = page.locator('[data-link-preview="spotify"] iframe');
  await expect(player).toHaveAttribute(
    'src',
    'https://open.spotify.com/embed/track/0Lr4kGOYn9l83EjuK6cZFQ'
  );
  await expect(player).toHaveAttribute('allow', /encrypted-media/);
  await expect(player).toBeVisible();
  await expect(
    page.locator('[data-link-preview="website"] .article-preview-card')
  ).toBeVisible();
  await expect(
    page.locator('.blog-article-content p a[href="https://example.com"]')
  ).toHaveText('inline link');
  const image = page.locator('.blog-article-content img[alt="Local image"]');
  await expect
    .poll(() =>
      image.evaluate(
        (node: HTMLImageElement) => node.complete && node.naturalWidth > 0
      )
    )
    .toBe(true);
  await player.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('link-previews.png') });
});

test('retains profile and portfolio navigation', async ({ page }) => {
  for (const route of ['/profile', '/portfolio']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1').first()).toHaveText(/\S/);
    await expect(page.getByText('Cannot read properties of null')).toHaveCount(
      0
    );
  }
});
