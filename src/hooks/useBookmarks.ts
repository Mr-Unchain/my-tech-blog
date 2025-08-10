// src/hooks/useBookmarks.ts
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  runTransaction,
  Timestamp
} from 'firebase/firestore';
import { COLLECTIONS, type Bookmark, type BlogStats } from '../lib/firebase-collections';

// ユーザーセッションID生成（匿名ユーザー用）
function generateSessionId(): string {
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  if (!isBrowser) return 'session_ssr';
  const existingId = localStorage.getItem('user_session_id');
  if (existingId) return existingId;
  const newId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('user_session_id', newId);
  return newId;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useState(() => generateSessionId());

  // 初期化: ユーザーのブックマーク一覧を取得
  useEffect(() => {
    loadBookmarks();
  }, [userId]);

  const loadBookmarks = async () => {
    if (!db) return;
    
    try {
      setLoading(true);
      const bookmarksRef = collection(db, COLLECTIONS.BOOKMARKS);
      const q = query(bookmarksRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const bookmarkIds = querySnapshot.docs.map(doc => doc.data().blogId);
      setBookmarks(bookmarkIds);
      
      // LocalStorage と同期
      localStorage.setItem('bookmarks_' + userId, JSON.stringify(bookmarkIds));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      
      // Firebase エラー時はLocalStorageから復元
      const stored = localStorage.getItem('bookmarks_' + userId);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (blogId: string, metadata?: { title: string; category: string[]; eyecatch: string }) => {
    if (!db) {
      // Firebase 未初期化時はLocalStorageのみで動作
      const isCurrentlyBookmarked = bookmarks.includes(blogId);
      const newBookmarks = isCurrentlyBookmarked 
        ? bookmarks.filter(id => id !== blogId)
        : [...bookmarks, blogId];
      
      setBookmarks(newBookmarks);
      localStorage.setItem('bookmarks_' + userId, JSON.stringify(newBookmarks));
      return;
    }

    setLoading(true);
    
    try {
      const isCurrentlyBookmarked = bookmarks.includes(blogId);
      
      if (isCurrentlyBookmarked) {
        // ブックマーク削除
        await removeBookmark(blogId);
      } else {
        // ブックマーク追加
        await addBookmark(blogId, metadata);
      }
      
      // 統計更新とローカル状態更新
      await updateBlogStats(blogId, isCurrentlyBookmarked ? -1 : 1);
      await loadBookmarks();
      
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      
      // エラー時はローカルのみで処理
      const newBookmarks = bookmarks.includes(blogId)
        ? bookmarks.filter(id => id !== blogId)
        : [...bookmarks, blogId];
      
      setBookmarks(newBookmarks);
      localStorage.setItem('bookmarks_' + userId, JSON.stringify(newBookmarks));
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (blogId: string, metadata?: { title: string; category: string[]; eyecatch: string }) => {
    const bookmarksRef = collection(db, COLLECTIONS.BOOKMARKS);
    
    const newBookmark: Omit<Bookmark, 'id'> = {
      userId,
      blogId,
      createdAt: Timestamp.now(),
      metadata
    };
    
    await addDoc(bookmarksRef, newBookmark);
  };

  const removeBookmark = async (blogId: string) => {
    const bookmarksRef = collection(db, COLLECTIONS.BOOKMARKS);
    const q = query(
      bookmarksRef, 
      where('userId', '==', userId),
      where('blogId', '==', blogId)
    );
    
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach(async (docSnapshot) => {
      await deleteDoc(docSnapshot.ref);
    });
  };

  const updateBlogStats = async (blogId: string, countChange: number) => {
    const statsRef = doc(db, COLLECTIONS.BLOG_STATS, blogId);
    
    await runTransaction(db, async (transaction) => {
      const statsDoc = await transaction.get(statsRef);
      
      if (statsDoc.exists()) {
        const currentCount = statsDoc.data()?.bookmarkCount || 0;
        transaction.update(statsRef, {
          bookmarkCount: Math.max(0, currentCount + countChange),
          lastUpdated: Timestamp.now()
        });
      } else {
        // 新規作成
        const newStats: BlogStats = {
          blogId,
          bookmarkCount: Math.max(0, countChange),
          viewCount: 0,
          reactionCounts: {
            like: 0,
            helpful: 0,
            insightful: 0,
            inspiring: 0
          },
          lastUpdated: Timestamp.now()
        };
        transaction.set(statsRef, newStats);
      }
    });
  };

  const isBookmarked = (blogId: string): boolean => {
    return bookmarks.includes(blogId);
  };

  const getBookmarkCount = (blogId: string): number => {
    // 今後統計取得機能を実装予定
    return 0;
  };

  return {
    bookmarks,
    loading,
    toggleBookmark,
    isBookmarked,
    getBookmarkCount,
    userId
  };
}