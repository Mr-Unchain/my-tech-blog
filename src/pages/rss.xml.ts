// src/pages/rss.xml.ts
import type { APIRoute } from "astro";
import { getBlogs } from "../lib/microcms";
import type { Blog } from "../lib/microcms";

const BASE_URL = "https://monologger.dev";
const SITE_TITLE = "Monologger";
const SITE_DESCRIPTION =
  "ITまわりで日々の気づきや試してみたメモをゆるく残すブログ。ツールや小ワザ、学びの断片を記録しています。";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const blogs = await getBlogs({
    limit: 20,
    orders: "-publishedAt",
    fields: "id,title,description,publishedAt,updatedAt,category",
  });

  const items = blogs.contents
    .map((post: Blog) => {
      const pubDate = new Date(post.publishedAt || "").toUTCString();
      const categories = post.category
        .filter(Boolean)
        .map((cat: string) => `      <category>${escapeXml(cat)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.id}/</link>
      <description>${escapeXml(post.description || "")}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.id}/</guid>
${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${BASE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>ja</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
