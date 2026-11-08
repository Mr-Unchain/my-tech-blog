import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [id, ...titleParts] = process.argv.slice(2);
if (!id || !/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
  console.error('Usage: npm run article:new -- article-id "Article title"');
  process.exit(1);
}
const directory = path.resolve('src/content/drafts');
const title = titleParts.join(' ') || id;
const content = `---\nid: ${JSON.stringify(id)}\ntitle: ${JSON.stringify(title)}\ndescription: "記事の概要"\ncategory: ["開発ログ"]\ndraft: true\neyecatch: "/placeholder.svg"\n---\n\n## きっかけ\n\nここから本文を書いてください。\n\n## 試したこと\n\n## 分かったこと\n`;
try {
  await mkdir(directory, { recursive: true });
  const publishedDirectory = path.resolve('src/content/blog');
  const hasId = async (sourceDirectory: string) =>
    (await readdir(sourceDirectory, { withFileTypes: true })).some(
      (entry) =>
        entry.isFile() &&
        /\.mdx?$/i.test(entry.name) &&
        path.parse(entry.name).name === id
    );
  const existingDirectory = (await hasId(publishedDirectory))
    ? 'blog'
    : (await hasId(directory))
      ? 'drafts'
      : null;
  if (existingDirectory) {
    console.error(
      `Article ID "${id}" already exists in src/content/${existingDirectory}.`
    );
    process.exitCode = 1;
  } else {
    await writeFile(path.join(directory, `${id}.md`), content, { flag: 'wx' });
    console.log(`Created local-only draft: src/content/drafts/${id}.md`);
    console.log(
      `Preview with npm run dev, then open http://localhost:4321/blog/${id}/`
    );
  }
} catch {
  console.error(
    'Draft could not be created. Check whether the ID already exists.'
  );
  process.exitCode = 1;
}
