import React, { useState, useEffect } from "react";
import type { Blog } from "../lib/microcms";

interface Props {
  posts: Blog[];
}

type Direction = "next" | "prev";

const HeroSlideshowReact: React.FC<Props> = ({ posts }) => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const total = posts.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [total]);

  const handleNext = () => {
    setPrev(current);
    setCurrent((prevIdx) => (prevIdx + 1) % total);
    setIsFading(true);
    setTimeout(() => setIsFading(false), 700);
  };

  const handlePrev = () => {
    setPrev(current);
    setCurrent((prevIdx) => (prevIdx - 1 + total) % total);
    setIsFading(true);
    setTimeout(() => setIsFading(false), 700);
  };

  const handleDot = (idx: number) => {
    if (idx === current) return;
    setPrev(current);
    setCurrent(idx);
    setIsFading(true);
    setTimeout(() => setIsFading(false), 700);
  };

  if (total === 0) return null;

  return (
    <section id="hero-slideshow-react" className="hero-slideshow">
      <div className="relative w-full h-full">
        {/* 前のスライド（フェードアウト） */}
        {isFading && prev !== null && (
          <Slide
            post={posts[prev]}
            fadeOut={true}
            key={posts[prev].id + "-out"}
          />
        )}
        {/* 現在のスライド（フェードイン） */}
        <Slide
          post={posts[current]}
          fadeIn={isFading}
          key={posts[current].id + "-in"}
        />
      </div>
      {/* Navigation Buttons */}
      <button
        className="hero-slideshow__prev-btn"
        onClick={handlePrev}
        aria-label="前のスライド"
        style={{ zIndex: 30 }}
      >
        &#10094;
      </button>
      <button
        className="hero-slideshow__next-btn"
        onClick={handleNext}
        aria-label="次のスライド"
        style={{ zIndex: 30 }}
      >
        &#10095;
      </button>
      {/* Indicator Dots */}
      <div className="hero-slideshow__dots">
        {posts.map((_, idx) => (
          <span
            key={idx}
            className={`hero-slideshow__dot ${idx === current ? "hero-slideshow__dot--active" : ""}`}
            onClick={() => handleDot(idx)}
          />
        ))}
      </div>
    </section>
  );
};

const Slide: React.FC<{
  post: Blog;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ post, fadeIn, fadeOut }) => {
  let animationClass = "";
  if (fadeIn) {
    animationClass = "fade-in";
  } else if (fadeOut) {
    animationClass = "fade-out";
  }
  return (
    <a
      href={`/blog/${post.id}/`}
      className={`hero-slide ${animationClass}`}
      style={{ zIndex: fadeOut ? 10 : 20 }}
    >
      {/* 背景画像 */}
      <img
        src={post.eyecatch.url}
        alt=""
        width={1200}
        height={800}
        className="hero-slide__bg"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/10" />
      {/* 前景画像 */}
      <img
        src={post.eyecatch.url}
        alt={`「${post.title}」のアイキャッチ画像`}
        width={1200}
        height={800}
        className="hero-slide__fg"
      />
      <div className="hero-slide__overlay" />
      <div className="hero-slide__content">
        <h2 className="hero-slide__title">{post.title}</h2>
        <div className="hero-slide__meta">
          <div className="hero-slide__categories">
            {post.category.map((cat, idx) => (
              <a
                key={cat + idx}
                href={`/category/${cat}`}
                className="hero-slide__category"
              >
                {cat}
              </a>
            ))}
          </div>
          <time className="hero-slide__date">
            {formatDate(post.publishedAt || "")}
          </time>
        </div>
        <p className="hero-slide__desc">{post.description}</p>
      </div>
    </a>

  );
};

// SSR/CSRで差異が出ないように日付を固定フォーマットで出力
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export default HeroSlideshowReact;
