import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('src/content/blog');
const allowedTypes = new Map([
  ['image/png', '.png'],
  ['image/jpeg', '.jpg'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/avif', '.avif'],
]);

try {
  const articles = [];
  let imageCount = 0;
  let totalBytes = 0;
  for (const filename of (await readdir(root))
    .filter((file) => file.endsWith('.md'))
    .sort()) {
    const source = await readFile(path.join(root, filename), 'utf8');
    const articleId = path.basename(filename, '.md');
    const matches = [
      ...new Set(
        source.match(/https:\/\/images\.microcms-assets\.io\/[^\s"')<>]+/g) ??
          []
      ),
    ];
    let updated = source;
    const assets = [];
    for (const remote of matches) {
      const canonical = new URL(remote);
      canonical.search = '';
      const hash = createHash('sha256')
        .update(canonical.href)
        .digest('hex')
        .slice(0, 16);
      const response = await fetch(canonical, {
        signal: AbortSignal.timeout(30000),
        redirect: 'error',
      });
      if (!response.ok)
        throw new Error(
          `Image fetch failed for ${articleId}: ${response.status}`
        );
      const extension = allowedTypes.get(
        response.headers.get('content-type')?.split(';')[0] ?? ''
      );
      if (!extension)
        throw new Error(`Unexpected image content type for ${articleId}.`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > 20 * 1024 * 1024)
        throw new Error(`Image exceeds 20 MB for ${articleId}.`);
      const metadata = await sharp(bytes).metadata();
      if (!metadata.width || !metadata.height)
        throw new Error(`Invalid image for ${articleId}.`);
      const relative = `/images/articles/${articleId}/${hash}${extension}`;
      const target = path.resolve('public', `.${relative}`);
      await mkdir(path.dirname(target), { recursive: true });
      try {
        const existing = await readFile(target);
        if (!existing.equals(bytes))
          throw new Error(
            `Refusing to overwrite a different image for ${articleId}.`
          );
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        await writeFile(target, bytes, { flag: 'wx' });
      }
      updated = updated.replaceAll(remote, relative);
      assets.push({
        path: relative,
        width: metadata.width,
        height: metadata.height,
        bytes: bytes.length,
      });
      totalBytes += bytes.length;
      imageCount++;
    }
    articles.push({ filename, source, updated, assets });
  }
  // Only rewrite source references after every remote image has been downloaded.
  for (const article of articles) {
    if (article.updated !== article.source)
      await writeFile(
        path.join(root, article.filename),
        article.updated,
        'utf8'
      );
  }
  console.log(
    JSON.stringify(
      {
        articles: articles.map(({ filename, assets }) => ({
          filename,
          assets,
        })),
        imageCount,
        totalBytes,
      },
      null,
      2
    )
  );
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Article image migration failed.'
  );
  process.exitCode = 1;
}
