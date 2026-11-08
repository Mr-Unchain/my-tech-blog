import { load } from 'cheerio';
import TurndownService from 'turndown';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Import only publicly served articles. No CMS key or draft API is used.
const site = 'https://monologger.dev';
const destination = path.resolve('src/content/blog');
const markdown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});
markdown.keep(['table', 'iframe', 'video', 'audio']);
markdown.remove(['script', 'style']);
markdown.addRule('simpleMarkdownTable', {
  filter: 'table',
  replacement: (_content, node) => {
    const cells = [...node.querySelectorAll('th, td')];
    if (
      cells.some(
        (cell) =>
          Number(cell.getAttribute('colspan') || 1) > 1 ||
          Number(cell.getAttribute('rowspan') || 1) > 1
      )
    ) {
      return `\n\n${node.outerHTML}\n\n`;
    }
    const rows = [...node.querySelectorAll('tr')].map((row) =>
      [...row.querySelectorAll('th, td')].map((cell) =>
        markdown
          .turndown(cell.innerHTML)
          .replace(/\|/g, '\\|')
          .replace(/\n+/g, '<br>')
      )
    );
    if (!rows.length) return '';
    const width = Math.max(...rows.map((row) => row.length));
    const line = (row) =>
      `| ${Array.from({ length: width }, (_, index) => row[index] || '').join(' | ')} |`;
    const [header, ...body] = rows;
    return `\n\n${[line(header), line(Array(width).fill('---')), ...body.map(line)].join('\n')}\n\n`;
  },
});
markdown.addRule('fencedCodeWithLanguage', {
  filter: (node) => node.nodeName === 'PRE' && node.querySelector('code'),
  replacement: (_content, node) => {
    const code = node.querySelector('code');
    const language = code.className.match(/language-([\w+-]+)/)?.[1] ?? '';
    const text = code.textContent.replace(/\n$/, '');
    const fence = '`'.repeat(
      Math.max(
        3,
        ...[...text.matchAll(/`+/g)].map((match) => match[0].length + 1)
      )
    );
    return `\n\n${fence}${language}\n${text}\n${fence}\n\n`;
  },
});

const fetchText = async (url) => {
  if (new URL(url).origin !== site)
    throw new Error('Unexpected article origin.');
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok)
    throw new Error(`Public fetch failed (${response.status}).`);
  return response.text();
};

try {
  const rss = load(await fetchText(`${site}/rss.xml`), { xml: true });
  const items = rss('item').toArray();
  if (!items.length)
    throw new Error('The public RSS feed contains no articles.');
  const articles = [];
  for (const item of items) {
    const entry = rss(item);
    const url = entry.find('link').text().trim();
    const id = new URL(url).pathname.split('/').filter(Boolean).at(-1);
    if (!id || !/^[A-Za-z0-9_-]{1,128}$/.test(id))
      throw new Error('Invalid public article ID.');
    const html = load(await fetchText(url));
    const body = html('.blog-article-content.article-content').first().html();
    if (!body?.trim()) throw new Error(`No article body found for ${id}.`);
    const publishedAt = new Date(
      html('meta[property="article:published_time"]').attr('content') ||
        entry.find('pubDate').text()
    ).toISOString();
    const modified = html('meta[property="article:modified_time"]').attr(
      'content'
    );
    const updatedAt =
      modified && Number.isFinite(Date.parse(modified))
        ? new Date(modified).toISOString()
        : undefined;
    const metadata = {
      id,
      title: entry.find('title').text().trim(),
      description: entry.find('description').text().trim(),
      category: entry
        .find('category')
        .toArray()
        .map((category) => rss(category).text()),
      draft: false,
      publishedAt,
      updatedAt:
        updatedAt && updatedAt >= publishedAt ? updatedAt : publishedAt,
      eyecatch:
        html('meta[property="og:image"]').attr('content') || '/placeholder.svg',
    };
    const frontmatter = Object.entries(metadata)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join('\n');
    articles.push({
      id,
      text: `---\n${frontmatter}\n---\n\n${markdown.turndown(body)}\n`,
    });
  }
  // Check all paths before writing; never replace an existing author-edited file.
  for (const article of articles) {
    const exists = await access(
      path.join(destination, `${article.id}.md`)
    ).then(
      () => true,
      () => false
    );
    if (exists) throw new Error(`Refusing to overwrite ${article.id}.md.`);
  }
  await mkdir(destination, { recursive: true });
  for (const article of articles) {
    await writeFile(path.join(destination, `${article.id}.md`), article.text, {
      flag: 'wx',
    });
  }
  console.log(
    `Imported ${articles.length} public articles. Run npm run validate:content before publishing.`
  );
  console.log(
    'The RSS feed contains at most 20 articles; verify the public article count separately.'
  );
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Article import failed.'
  );
  process.exitCode = 1;
}
