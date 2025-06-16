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
  }, [total, current]);

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
        className="prev-btn absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full text-white transition-colors z-30 pointer-events-auto"
        onClick={handlePrev}
        aria-label="前のスライド"
        style={{ zIndex: 30 }}
      >
        &#10094;
      </button>
      <button
        className="next-btn absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full text-white transition-colors z-30 pointer-events-auto"
        onClick={handleNext}
        aria-label="次のスライド"
        style={{ zIndex: 30 }}
      >
        &#10095;
      </button>
      {/* Indicator Dots */}
      <div className="dots-container absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {posts.map((_, idx) => (
          <span
            key={idx}
            className={`dot h-3 w-3 rounded-full cursor-pointer transition-colors ${idx === current ? "bg-white" : "bg-white/50"}`}
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
    <div
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
      <div className="absolute inset-0 bg-black/50" />
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
        <p className="hero-slide__desc">{post.description}</p>
      </div>
    </div>
  );
};

export default HeroSlideshowReact;

// .fade-in { animation: fadeIn 0.7s forwards; }
// .fade-out { animation: fadeOut 0.7s forwards; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } } 