import { describe, expect, it, vi } from 'vitest';
import type { Element, Root } from 'hast';
import rehypeLinkPreviews, {
  spotifyEmbedUrl,
} from '../../src/lib/articles/link-previews';
import { isPublicAddress, publicHttpsUrl } from '../../src/lib/public-html';

const id = '0Lr4kGOYn9l83EjuK6cZFQ';
const paragraph = (href: string, inline = false): Element => ({
  type: 'element',
  tagName: 'p',
  properties: {},
  children: [
    ...(inline ? [{ type: 'text' as const, value: 'An inline link: ' }] : []),
    {
      type: 'element',
      tagName: 'a',
      properties: { href },
      children: [{ type: 'text', value: href }],
    },
  ],
});

describe('Markdown link previews', () => {
  it('normalizes Spotify share links and preserves encrypted-media permission', async () => {
    const tree: Root = {
      type: 'root',
      children: [
        paragraph(`https://open.spotify.com/intl-ja/track/${id}?si=share`),
      ],
    };
    const metadata = vi.fn();
    await rehypeLinkPreviews({ fetchMetadata: metadata })(tree);
    const preview = tree.children[0] as Element;
    expect(preview.properties['data-link-preview']).toBe('spotify');
    const iframe = preview.children[0] as Element;
    expect(iframe.properties.src).toBe(
      `https://open.spotify.com/embed/track/${id}`
    );
    expect(iframe.properties.allow).toContain('encrypted-media');
    expect(iframe.properties.height).toBe(152);
    expect(metadata).not.toHaveBeenCalled();
  });

  it('keeps inline and internal links unchanged', async () => {
    const inline = paragraph(`https://open.spotify.com/track/${id}`, true);
    const internal = paragraph('https://monologger.dev/blog/example/');
    const tree: Root = { type: 'root', children: [inline, internal] };
    const metadata = vi.fn();
    await rehypeLinkPreviews({
      siteUrl: 'https://monologger.dev',
      fetchMetadata: metadata,
    })(tree);
    expect(inline.tagName).toBe('p');
    expect(internal.tagName).toBe('p');
    expect(metadata).not.toHaveBeenCalled();
  });

  it('uses website metadata as escaped text and falls back when it is unavailable', async () => {
    const tree: Root = {
      type: 'root',
      children: [paragraph('https://example.com/article')],
    };
    const metadata = vi
      .fn()
      .mockResolvedValue({
        title: '<script>text</script>',
        description: 'Description',
        image: '',
        siteName: 'Example',
      });
    await rehypeLinkPreviews({ fetchMetadata: metadata })(tree);
    const card = (tree.children[0] as Element).children[0] as Element;
    expect(card.properties.href).toBe('https://example.com/article');
    const title = (card.children[0] as Element).children[0] as Element;
    expect(title.children).toEqual([
      { type: 'text', value: '<script>text</script>' },
    ]);
    const fallback: Root = {
      type: 'root',
      children: [paragraph('https://example.com/other')],
    };
    await rehypeLinkPreviews({
      fetchMetadata: vi.fn().mockRejectedValue(new Error('offline')),
    })(fallback);
    expect(
      (fallback.children[0] as Element).properties['data-link-preview']
    ).toBe('website');
  });

  it('rejects lookalike Spotify origins and unsupported resource paths', () => {
    expect(
      spotifyEmbedUrl(`https://open.spotify.com.attacker.test/track/${id}`)
    ).toBeNull();
    expect(
      spotifyEmbedUrl(`https://user:password@open.spotify.com/track/${id}`)
    ).toBeNull();
    expect(
      spotifyEmbedUrl('https://open.spotify.com/track/not-an-id')
    ).toBeNull();
    expect(
      spotifyEmbedUrl(`https://open.spotify.com/album/${id}`)?.height
    ).toBe(352);
  });
});

describe('preview network boundary', () => {
  it.each([
    '127.0.0.1',
    '10.0.0.1',
    '192.168.1.1',
    '169.254.169.254',
    '172.16.0.1',
    '::1',
    '::ffff:127.0.0.1',
    'fd00::1',
  ])('rejects private address %s', (address) => {
    expect(isPublicAddress(address)).toBe(false);
  });
  it('accepts public HTTPS and rejects credentials, protocols and local hosts', () => {
    expect(publicHttpsUrl('https://example.com/article')?.hostname).toBe(
      'example.com'
    );
    for (const url of [
      'http://example.com',
      'https://localhost',
      'https://192.168.1.1',
      'https://user:pass@example.com',
      'https://example.com:8443',
    ]) {
      expect(publicHttpsUrl(url)).toBeNull();
    }
  });
});
