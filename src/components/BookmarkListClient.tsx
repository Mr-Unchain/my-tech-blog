/**
 * BookmarkListClient - ブックマーク一覧のクライアントサイドレンダリング
 *
 * LocalStorage のブックマーク情報を元に microCMS API から記事情報を取得し表示する。
 * SSR ではなく CSR で動作（ユーザー固有データのため）。
 */
import { useState, useEffect } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';

interface BookmarkArticle {
  id: string;
  title: string;
  publishedAt?: string;
  eyecatch?: { url: string };
  category?: { name: string }[];
}

export default function BookmarkListClient() {
  const { bookmarks, loading: bookmarkLoading, toggleBookmark, userId } = useBookmarks();
  const [articles, setArticles] = useState<BookmarkArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // ブックマーク済み記事の情報を取得
  useEffect(() => {
    if (bookmarkLoading) return;

    if (bookmarks.length === 0) {
      setArticles([]);
      setLoadingArticles(false);
      return;
    }

    const fetchArticles = async () => {
      setLoadingArticles(true);
      try {
        // microCMS のフィルタで複数 ID を取得
        const ids = bookmarks.join(',');
        const res = await fetch(`/api/bookmarks-list?ids=${encodeURIComponent(ids)}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Error fetching bookmarked articles:', error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [bookmarks, bookmarkLoading]);

  const handleRemove = async (blogId: string) => {
    await toggleBookmark(blogId);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ローディング状態
  if (bookmarkLoading || loadingArticles) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{
              borderColor: 'var(--color-border)',
              borderTopColor: 'var(--color-accent)',
            }}
          />
          <span style={{ color: 'var(--color-text-muted)' }} className="text-sm">
            読み込み中...
          </span>
        </div>
      </div>
    );
  }

  // 空状態
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-16 h-16 mb-4"
          style={{ color: 'var(--color-text-muted)' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
        </svg>
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--color-text-heading)' }}
        >
          ブックマークはまだありません
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          記事ページのブックマークボタンから、お気に入りの記事を保存できます。
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: 'var(--color-accent)',
            color: '#fff',
          }}
        >
          記事一覧へ
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
        {bookmarks.length}件のブックマーク
      </p>

      {articles.map((article) => (
        <div
          key={article.id}
          className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200"
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* サムネイル */}
          {article.eyecatch?.url && (
            <a
              href={`/blog/${article.id}/`}
              className="flex-shrink-0 rounded-lg overflow-hidden"
              style={{ width: '120px', height: '75px' }}
            >
              <img
                src={`${article.eyecatch.url}?w=240&h=150&fit=crop`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </a>
          )}

          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            <a
              href={`/blog/${article.id}/`}
              className="block font-bold text-base leading-tight mb-1 transition-colors hover:underline"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {article.title}
            </a>
            {article.publishedAt && (
              <time
                className="text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {formatDate(article.publishedAt)}
              </time>
            )}
          </div>

          {/* 解除ボタン */}
          <button
            onClick={() => handleRemove(article.id)}
            className="flex-shrink-0 p-2 rounded-lg transition-colors"
            style={{
              color: 'var(--color-text-muted)',
              background: 'transparent',
            }}
            title="ブックマーク解除"
            aria-label={`「${article.title}」のブックマークを解除`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: 'var(--color-accent)' }}
            >
              <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
