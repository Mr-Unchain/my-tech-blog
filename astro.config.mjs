// astro.config.mjs
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel"; // vercelをインポート
import partytown from "@astrojs/partytown";
import { defineConfig } from "astro/config";

// 追加: 動的URLをサイトマップに含める（microCMSから記事/カテゴリを取得）
const BASE_URL = "https://monologger.dev";
const HIDDEN_BLOG_IDS = new Set([
  "ip2e0cllvfwb",
  "docker-intro-part1",
  "docker-intro-part2",
  "docker-intro-part3",
  "docker-intro-part4",
]);

async function fetchDynamicSitemapPages() {
  try {
    const service = process.env.VITE_MICROCMS_SERVICE_DOMAIN || "";
    const apiKey = process.env.MICROCMS_API_KEY || "";
    if (!service || !apiKey) return { pages: [], dates: new Map() };
    const endpoint = `https://${service}.microcms.io/api/v1/blogs?fields=id,category,publishedAt,updatedAt&limit=1000`;
    const res = await fetch(endpoint, { headers: { "X-API-KEY": apiKey } });
    if (!res.ok) return { pages: [], dates: new Map() };
    const data = await res.json();
    const ids = Array.isArray(data?.contents) ? data.contents : [];
    const pages = [];
    const dates = new Map();
    const categories = new Set();
    for (const item of ids) {
      if (item?.id && !HIDDEN_BLOG_IDS.has(item.id)) {
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
  } catch {
    return { pages: [], dates: new Map() };
  }
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
  vite: {
    server: {
      host: true,
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
