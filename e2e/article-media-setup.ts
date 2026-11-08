import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

export default async function prepareArticleMediaDraft() {
  const id = `media-preview-verification-${randomUUID()}`;
  const draftPath = path.resolve(`src/content/drafts/${id}.md`);
  await mkdir(path.dirname(draftPath), { recursive: true });
  await writeFile(
    draftPath,
    `---\nid: ${id}\ntitle: Media preview verification\ndescription: Temporary browser verification\ncategory: [Test]\ndraft: true\n---\n\n![Local image](/images/articles/2-q1jo80jo8/fb6e07f3525599e2.png)\n\nhttps://open.spotify.com/track/0Lr4kGOYn9l83EjuK6cZFQ\n\nhttps://docs.astro.build/en/guides/markdown-content/\n\nThis [inline link](https://example.com) stays in the sentence.\n`,
    { flag: 'wx' }
  );
  process.env.ARTICLE_MEDIA_DRAFT_ID = id;

  return async () => {
    await unlink(draftPath);
    delete process.env.ARTICLE_MEDIA_DRAFT_ID;
  };
}
