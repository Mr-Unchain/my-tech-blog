/**
 * BookmarkButton - 記事ブックマーク追加/削除ボタン
 *
 * 使い方:
 * - 通常: <BookmarkButton blogId="xxx" title="記事タイトル" />
 * - コンパクト（StickyBar用）: <BookmarkButton blogId="xxx" compact />
 */
import { useState } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';

interface Props {
  blogId: string;
  title?: string;
  compact?: boolean;
}

export default function BookmarkButton({ blogId, title, compact = false }: Props) {
  const { bookmarkCount, loading, toggleBookmark, isBookmarked } = useBookmarks(blogId);
  const [animating, setAnimating] = useState(false);
  const bookmarked = isBookmarked(blogId);

  const handleClick = async () => {
    if (loading) return;

    setAnimating(true);
    await toggleBookmark(blogId, title ? {
      title,
      category: [],
      eyecatch: '',
    } : undefined);

    setTimeout(() => setAnimating(false), 600);
  };

  // コンパクトモード（StickyReactionBar 用）
  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`sticky-reaction-btn ${bookmarked ? 'reacted' : ''} ${animating ? 'animating' : ''}`}
        aria-label={`ブックマーク${bookmarked ? '済み - クリックで解除' : ' - クリックで追加'}`}
        title={bookmarked ? 'ブックマーク解除' : 'ブックマークに追加'}
      >
        <span className={`sticky-reaction-emoji ${animating ? 'bounce' : ''}`}>
          {bookmarked ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-accent)' }}>
              <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-muted)' }}>
              <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
            </svg>
          )}
        </span>
        {bookmarkCount > 0 && (
          <span className="sticky-reaction-count">{bookmarkCount}</span>
        )}
      </button>
    );
  }

  // 通常モード（インライン用）
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`bookmark-btn group ${bookmarked ? 'bookmarked' : ''}`}
      aria-label={`ブックマーク${bookmarked ? '済み - クリックで解除' : ' - クリックで追加'}`}
      title={bookmarked ? 'ブックマーク解除' : 'ブックマークに追加'}
    >
      <span className="bookmark-icon-wrapper">
        {bookmarked ? (
          <svg className="bookmark-icon w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
          </svg>
        ) : (
          <svg className="bookmark-icon w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
          </svg>
        )}
      </span>
      {bookmarkCount > 0 && (
        <span className="bookmark-count">{bookmarkCount}</span>
      )}
    </button>
  );
}
