// src/utils/recommend.ts
import type { Blog } from "../lib/microcms";

function normalizeText(input: string | undefined | null): string {
  return (input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[\s\u3000]+/g, " ")
    .toLowerCase();
}

function tokenize(text: string): string[] {
  // ざっくり英単語＋日本語一文字単位のトークン化
  const tokens: string[] = [];
  const asciiWords = text.match(/[a-z0-9]{2,}/g) || [];
  tokens.push(...asciiWords);
  // 日本語などCJKは1文字ずつ
  const cjk = text.replace(/[a-z0-9\s_\-]+/g, "");
  tokens.push(...cjk.split("").filter(Boolean));
  return tokens;
}

function buildWeights(blog: Blog): Map<string, number> {
  const map = new Map<string, number>();
  const add = (t: string, w: number) => map.set(t, (map.get(t) || 0) + w);

  const titleTokens = tokenize(normalizeText(blog.title));
  const descTokens = tokenize(normalizeText(blog.description));
  const contentTokens = tokenize(normalizeText(blog.content));
  const categories = Array.isArray(blog.category) ? blog.category : [];

  titleTokens.forEach((t) => add(t, 3));
  descTokens.forEach((t) => add(t, 2));
  contentTokens.slice(0, 400).forEach((t) => add(t, 1)); // コスト抑制
  categories.forEach((c) => add(normalizeText(String(c)), 4));

  return map;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let a2 = 0;
  let b2 = 0;
  a.forEach((wa, k) => {
    a2 += wa * wa;
    const wb = b.get(k) || 0;
    if (wb) dot += wa * wb;
  });
  b.forEach((wb) => {
    b2 += wb * wb;
  });
  if (!a2 || !b2) return 0;
  return dot / (Math.sqrt(a2) * Math.sqrt(b2));
}

export function getRelatedPosts(current: Blog, candidates: Blog[], limit = 6): Blog[] {
  const currentW = buildWeights(current);
  const scored = candidates
    .filter((b) => b.id !== current.id)
    .map((b) => ({ post: b, score: cosineSimilarity(currentW, buildWeights(b)) }))
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((s) => s.post);
}


