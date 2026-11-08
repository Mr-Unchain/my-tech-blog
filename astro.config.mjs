// astro.config.mjs
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel"; // vercelをインポート
import partytown from "@astrojs/partytown";
import { defineConfig } from "astro/config";
import { validateContent } from './src/lib/articles/validation';
import rehypeLinkPreviews from './src/lib/articles/link-previews';

// Build the public sitemap from the same validated Markdown source.
const BASE_URL = "https://monologger.dev";

async function fetchDynamicSitemapPages() {
    const result = await validateContent();
    if (!result.success) throw new Error('Article validation failed while creating the sitemap.');
    const ids = result.articles.filter((article) => article.publicationState === 'published');
    const pages = [];
    const dates = new Map();
    const categories = new Set();
    for (const item of ids) {
      if (item?.id) {
        const url = `${BASE_URL}/blog/${item.id}/`;
        pages.push(url);
        const lastmod = item.updatedAt || item.publishedAt;
        if (lastmod) dates.set(url, new Date(lastmod));
      }
      const cats = Array.isArray(item?.category) ? item.category : [];
      for (const c of cats) if (c) categories.add(String(c));
    }
    for (const c of categories) pages.push(`${BASE_URL}/category/${encodeURIComponent(c)}/`);
    return { pages, dates };
}

const { pages: dynamicPages, dates: pageDates } = await fetchDynamicSitemapPages();

export default defineConfig({
  site: BASE_URL, // 新しいドメインに変更
  output: "server", // outputは"server"のまま
  trailingSlash: 'ignore',
  adapter: vercel(), // adapterをvercel()に変更
  integrations: [
    tailwind(),
    sitemap({
      customPages: dynamicPages,
      filter: (page) =>
        !page.includes('/search') &&
        !page.includes('/404') &&
        !page.includes('/drafts') &&
        !page.includes('/api/'),
      serialize: (item) => ({
        ...item,
        changefreq: 'weekly',
        priority: item.url.includes('/blog/') ? 0.8 : 0.6,
        lastmod: pageDates.get(item.url) ?? new Date(),
      })
    }),
    react(),
    partytown({ config: { forward: ["dataLayer.push"] } }),
  ],
  image: {
    domains: ["images.microcms-assets.io"],
  },
  markdown: {
    rehypePlugins: [[rehypeLinkPreviews, { siteUrl: BASE_URL }]],
  },
  vite: {
    server: {
      host: '127.0.0.1',
      hmr: {
        clientPort: Number(process.env.PORT) || 3000,
        host: 'localhost',
        protocol: 'ws'
      },
      watch: { usePolling: true },
      strictPort: false
    },
    build: {
      rollupOptions: {
        plugins: [
          {
            name: 'critters-after-build',
            closeBundle: async () => {
              if (process.env.NODE_ENV !== 'production') return;
              try {
                const { default: Critters } = await import('critters');
                const fs = await import('node:fs/promises');
                const path = await import('node:path');
                const outDir = path.resolve(process.cwd(), '.vercel/output/static');
                const altOut = path.resolve(process.cwd(), 'dist');
                const baseDir = await fs.stat(outDir).then(()=>outDir).catch(()=>altOut);
                const critters = new Critters({ path: baseDir, preload: 'swap', pruneSource: false });
                async function walk(dir){
                  const ents = await fs.readdir(dir, { withFileTypes: true });
                  for (const e of ents){
                    const p = path.join(dir, e.name);
                    if (e.isDirectory()) await walk(p);
                    else if (e.isFile() && p.endsWith('.html')){
                      const html = await fs.readFile(p, 'utf8');
                      const out = await critters.process(html);
                      await fs.writeFile(p, out, 'utf8');
                    }
                  }
                }
                await walk(baseDir);
              } catch {}
            }
          }
        ]
      }
    }
  }
});
