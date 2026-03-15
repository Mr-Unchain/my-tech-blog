import React from "react";
import type { Blog } from "../lib/microcms";

interface Props {
  posts: Blog[];
}

/**
 * HeroRecommendations - 推薦記事をコンパクトなカード群で表示
 * 旧 HeroSlideshowReact（自動スライドショー）を簡素化
 */
const HeroRecommendations: React.FC<Props> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <section
      className="hero-recommendations"
      aria-label="おすすめ記事"
      data-testid="hero-recommendations"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <a
            key={post.id}
            href={`/blog/${post.id}/`}
            className="hero-rec-card group"
          >
            <div className="hero-rec-card__image">
              <img
                src={(post.eyecatch?.url || "/placeholder.svg") + "?w=600&q=70"}
                alt={`${post.title}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="hero-rec-card__body">
              <div className="hero-rec-card__categories">
                {post.category.slice(0, 2).map((cat, idx) => (
                  <span key={cat + idx} className="hero-rec-card__category">
                    {cat}
                  </span>
                ))}
              </div>
              <h3 className="hero-rec-card__title">{post.title}</h3>
              <time className="hero-rec-card__date">
                {formatDate(post.publishedAt || "")}
              </time>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export default HeroRecommendations;
