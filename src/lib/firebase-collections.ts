// src/lib/firebase-collections.ts
import { Timestamp } from "firebase/firestore";

// ブックマーク機能用の型定義
export interface Bookmark {
  userId: string;      // ユーザーID (匿名の場合はsessionId)
  blogId: string;      // 記事ID
  createdAt: Timestamp;
  metadata?: {
    title: string;
    category: string[];
    eyecatch: string;
  };
}

// ブログ統計情報用の型定義
export interface BlogStats {
  blogId: string;
  bookmarkCount: number;
  viewCount: number;
  reactionCounts: {
    like: number;
    helpful: number;
    insightful: number;
    inspiring: number;
  };
  lastUpdated: Timestamp;
}

// リアクション機能用の型定義
export interface Reaction {
  userId: string;
  blogId: string;
  reactionType: 'like' | 'helpful' | 'insightful' | 'inspiring';
  createdAt: Timestamp;
}

// リアクション種類の定義
export const REACTIONS = {
  LIKE: { emoji: '👍', label: 'いいね', color: 'text-blue-400' },
  HELPFUL: { emoji: '💡', label: '参考になった', color: 'text-yellow-400' },
  INSIGHTFUL: { emoji: '🎯', label: '深い洞察', color: 'text-purple-400' },
  INSPIRING: { emoji: '✨', label: 'インスパイア', color: 'text-pink-400' }
} as const;

// Firebase コレクション名の定数
export const COLLECTIONS = {
  BOOKMARKS: 'bookmarks',
  BLOG_STATS: 'blog_stats',
  REACTIONS: 'reactions',
  VIEWS: 'views' // 既存のviewsコレクション
} as const;