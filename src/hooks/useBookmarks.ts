// src/hooks/useBookmarks.ts
import { useState, useEffect, useCallback } from 'react';
import { generateSessionId } from '../lib/utils';

interface BookmarkStatus {
  isBookmarked: boolean;
  bookmarkCount: number;
}

/**
 * ブックマーク管理フック
 * - API経由でブックマークの取得・トグルを行う
 * - LocalStorageフォールバックで offline 対応
 */
export function useBookmarks(blogId?: string) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId] = useState(() => generateSessionId());

  // 特定記事のブックマーク状態を取得
  const fetchStatus = useCallback(async (targetBlogId: string): Promise<BookmarkStatus> => {
    try {
      const res = await fetch(`/api/bookmarks/${targetBlogId}?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      // API失敗時はLocalStorageから復元
      const stored = localStorage.getItem('bookmarks_' + userId);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      return { isBookmarked: ids.includes(targetBlogId), bookmarkCount: 0 };
    }
  }, [userId]);

  // 初期化: blogId が指定されている場合はその記事のステータスを取得
  useEffect(() => {
    if (!blogId) {
      // blogId未指定 = 一覧モード: LocalStorageからブックマーク一覧を復元
      const stored = localStorage.getItem('bookmarks_' + userId);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const status = await fetchStatus(blogId);
      if (!cancelled) {
        setBookmarks(prev => {
          if (status.isBookmarked && !prev.includes(blogId)) return [...prev, blogId];
          if (!status.isBookmarked && prev.includes(blogId)) return prev.filter(id => id !== blogId);
          return prev;
        });
        setBookmarkCount(status.bookmarkCount);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [blogId, userId, fetchStatus]);

  // ブックマークトグル
  const toggleBookmark = async (
    targetBlogId: string,
    metadata?: { title: string; category: string[]; eyecatch: string }
  ) => {
    const isCurrentlyBookmarked = bookmarks.includes(targetBlogId);

    // 楽観的更新
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarks.filter(id => id !== targetBlogId)
      : [...bookmarks, targetBlogId];
    setBookmarks(newBookmarks);
    setBookmarkCount(prev => Math.max(0, prev + (isCurrentlyBookmarked ? -1 : 1)));
    localStorage.setItem('bookmarks_' + userId, JSON.stringify(newBookmarks));

    setLoading(true);
    try {
      const res = await fetch(`/api/bookmarks/${targetBlogId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, metadata }),
      });

      if (!res.ok) throw new Error('API error');

      // API成功後に最新カウントを取得
      const status = await fetchStatus(targetBlogId);
      setBookmarkCount(status.bookmarkCount);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // 楽観的更新をそのまま維持（LocalStorageには保存済み）
    } finally {
      setLoading(false);
    }
  };

  const isBookmarked = (targetBlogId: string): boolean => {
    return bookmarks.includes(targetBlogId);
  };

  return {
    bookmarks,
    bookmarkCount,
    loading,
    toggleBookmark,
    isBookmarked,
    userId,
  };
}
