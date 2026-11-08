import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const script = path.resolve('scripts/new-article.ts');
const tsxLoader = pathToFileURL(
  createRequire(path.resolve('package.json')).resolve('tsx')
).href;
let workspace: string;

const runArticleNew = (id: string) =>
  spawnSync(
    process.execPath,
    ['--import', tsxLoader, script, id, 'New title'],
    {
      cwd: workspace,
      encoding: 'utf8',
    }
  );

beforeEach(async () => {
  workspace = await mkdtemp(path.join(tmpdir(), 'article-new-'));
  await mkdir(path.join(workspace, 'src/content/blog'), { recursive: true });
});

afterEach(async () => {
  await rm(workspace, { recursive: true, force: true });
});

describe('article:new', () => {
  it.each(['md', 'mdx'])(
    'rejects an ID used by a published .%s article',
    async (extension) => {
      await writeFile(
        path.join(workspace, `src/content/blog/existing.${extension}`),
        'published article'
      );

      const result = runArticleNew('existing');

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        'Article ID "existing" already exists in src/content/blog.'
      );
      await expect(
        readFile(path.join(workspace, 'src/content/drafts/existing.md'))
      ).rejects.toMatchObject({ code: 'ENOENT' });
    }
  );

  it('rejects an ID used by an existing .mdx draft', async () => {
    await mkdir(path.join(workspace, 'src/content/drafts'));
    await writeFile(
      path.join(workspace, 'src/content/drafts/existing.mdx'),
      'existing draft'
    );

    const result = runArticleNew('existing');

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'Article ID "existing" already exists in src/content/drafts.'
    );
    expect(
      await readFile(
        path.join(workspace, 'src/content/drafts/existing.mdx'),
        'utf8'
      )
    ).toBe('existing draft');
  });

  it('creates a new draft once without overwriting it', async () => {
    const created = runArticleNew('new-article');

    expect(created.status).toBe(0);
    const draftPath = path.join(workspace, 'src/content/drafts/new-article.md');
    const content = await readFile(draftPath, 'utf8');
    expect(content).toContain('id: "new-article"');

    const repeated = runArticleNew('new-article');
    expect(repeated.status).toBe(1);
    expect(await readFile(draftPath, 'utf8')).toBe(content);
  });
});
