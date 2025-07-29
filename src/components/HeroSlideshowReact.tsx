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
    <section id="hero-slideshow-react" className="hero-slideshow relative w-full h-[280px] md:h-[350px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
        className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-slate-800/90 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-400 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-30 backdrop-blur-sm"
        onClick={handlePrev}
        aria-label="前のスライド"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-slate-800/90 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-400 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-30 backdrop-blur-sm"
        onClick={handleNext}
        aria-label="次のスライド"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {posts.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === current 
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50 scale-110" 
                : "bg-slate-600 hover:bg-slate-500 border border-slate-500"
            }`}
            onClick={() => handleDot(idx)}
            aria-label={`スライド ${idx + 1} に移動`}
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
    animationClass = "animate-fade-in";
  } else if (fadeOut) {
    animationClass = "animate-fade-out";
  }
  
  return (
    <a
      href={`/blog/${post.id}/`}
      className={`absolute inset-0 block group ${animationClass}`}
      style={{ zIndex: fadeOut ? 10 : 20 }}
    >
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <img
          src={post.eyecatch?.url || "/placeholder.svg"}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20" />
      </div>
      
      {/* コンテンツ */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center">
            {/* テキストコンテンツ */}
            <div className="text-white space-y-4 max-w-3xl mx-auto">
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {(() => {
                  const [max, setMax] = React.useState(post.category.length);
                  React.useEffect(() => {
                    const update = () => {
                      setMax(window.innerWidth <= 640 ? 2 : post.category.length);
                    };
                    update();
                    window.addEventListener('resize', update);
                    return () => window.removeEventListener('resize', update);
                  }, [post.category.length]);
                  const cats = post.category.slice(0, max);
                  return (
                    <>
                      {cats.map((cat, idx) => (
                        <button
                          key={cat + idx}
                          className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg shadow-cyan-500/30 border border-cyan-400/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/category/${encodeURIComponent(cat)}/`;
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                      {max < post.category.length && (
                        <span className="px-3 py-1 bg-slate-700/90 text-slate-300 text-xs md:text-sm font-medium rounded-full backdrop-blur-sm border border-slate-600">
                          +{post.category.length - max}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-blue-200 transition-all duration-300 drop-shadow-2xl">
                {post.title}
              </h2>
              <p className="text-slate-200 text-base md:text-lg lg:text-xl leading-relaxed line-clamp-2 md:line-clamp-3 drop-shadow-lg font-light max-w-2xl mx-auto">
                {post.description}
              </p>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <time className="text-cyan-300 text-sm md:text-base font-medium">
                  {formatDate(post.publishedAt || "")}
                </time>
              </div>
            </div>
          </div>
        </div>
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
