// astro.config.mjs
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel"; // vercelをインポート
// import partytown from "@astrojs/partytown";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://monologger.dev", // 新しいドメインに変更
  output: "server", // outputは"server"のまま
  adapter: vercel(), // adapterをvercel()に変更
  integrations: [tailwind(), sitemap(), react()],
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
