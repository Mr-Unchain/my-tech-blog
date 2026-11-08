import type { Element, ElementContent, Root } from 'hast';
import { fetchOGP, shouldCreateLinkCard, type OGPData } from '../ogp';

const element = (
  tagName: string,
  properties: Element['properties'],
  children: ElementContent[] = []
): Element => ({ type: 'element', tagName, properties, children });
const text = (value: string): ElementContent => ({ type: 'text', value });

export function spotifyEmbedUrl(
  input: string
): { src: string; href: string; height: number } | null {
  try {
    const url = new URL(input);
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'open.spotify.com' ||
      url.username ||
      url.password ||
      url.port
    )
      return null;
    const match = url.pathname.match(
      /^\/(?:intl-[a-z]{2}\/)?(?:embed\/)?(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]{22})\/?$/
    );
    if (!match) return null;
    const [, type, id] = match;
    return {
      src: `https://open.spotify.com/embed/${type}/${id}`,
      href: `https://open.spotify.com/${type}/${id}`,
      height: ['track', 'episode', 'show'].includes(type) ? 152 : 352,
    };
  } catch {
    return null;
  }
}

export default function rehypeLinkPreviews(
  options: {
    siteUrl?: string;
    fetchMetadata?: (url: string) => Promise<OGPData | null>;
  } = {}
) {
  const metadata = options.fetchMetadata ?? fetchOGP;
  return async (tree: Root) => {
    const paragraphs: Element[] = [];
    const walk = (node: Root | Element) => {
      for (const child of node.children) {
        if (child.type !== 'element') continue;
        if (child.tagName === 'p') paragraphs.push(child);
        else if (!['pre', 'code', 'a'].includes(child.tagName)) walk(child);
      }
    };
    walk(tree);
    let count = 0;
    await Promise.all(
      paragraphs.map(async (paragraph) => {
        const nodes = paragraph.children.filter(
          (node) => node.type !== 'text' || node.value.trim()
        );
        const link = nodes[0];
        if (
          nodes.length !== 1 ||
          link?.type !== 'element' ||
          link.tagName !== 'a' ||
          link.children.some(
            (child) => child.type === 'element' && child.tagName === 'img'
          )
        )
          return;
        const href =
          typeof link.properties.href === 'string' ? link.properties.href : '';
        if (!shouldCreateLinkCard(href, options.siteUrl) || count++ >= 8)
          return;
        const spotify = spotifyEmbedUrl(href);
        paragraph.tagName = 'div';
        paragraph.properties = {
          className: ['article-link-preview'],
          'data-link-preview': spotify ? 'spotify' : 'website',
        };
        if (spotify) {
          paragraph.children = [
            element('iframe', {
              src: spotify.src,
              title: 'Spotify のプレビュー',
              width: '100%',
              height: spotify.height,
              frameBorder: 0,
              allow:
                'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
              allowFullScreen: true,
              loading: 'lazy',
              referrerPolicy: 'strict-origin-when-cross-origin',
            }),
            element(
              'a',
              {
                href: spotify.href,
                target: '_blank',
                rel: ['noopener', 'noreferrer'],
                className: ['preview-source-link'],
              },
              [text('Spotify で開く')]
            ),
          ];
          return;
        }
        let data: OGPData | null = null;
        try {
          data = await metadata(href);
        } catch {
          /* A failed preview must leave a usable link. */
        }
        const hostname = new URL(href).hostname;
        const title =
          data?.title ||
          link.children
            .filter((node) => node.type === 'text')
            .map((node) => node.value)
            .join('') ||
          href;
        const content = [
          element('span', { className: ['preview-title'] }, [text(title)]),
        ];
        if (data?.description)
          content.push(
            element('span', { className: ['preview-description'] }, [
              text(data.description),
            ])
          );
        content.push(
          element('span', { className: ['preview-hostname'] }, [
            text(data?.siteName || hostname),
          ])
        );
        const children: Element[] = [
          element('span', { className: ['preview-text'] }, content),
        ];
        if (data?.image)
          children.push(
            element('img', {
              src: data.image,
              alt: '',
              className: ['preview-image'],
              loading: 'lazy',
              decoding: 'async',
              width: 160,
              height: 110,
            })
          );
        paragraph.children = [
          element(
            'a',
            {
              href,
              className: ['article-preview-card'],
              target: '_blank',
              rel: ['noopener', 'noreferrer'],
            },
            children
          ),
        ];
      })
    );
  };
}
