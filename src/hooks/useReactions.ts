// src/hooks/useReactions.ts
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
  getDoc,
  runTransaction,
  Timestamp
} from 'firebase/firestore';
import { COLLECTIONS, REACTIONS, type Reaction, type BlogStats } from '../lib/firebase-collections';

export type ReactionType = Lowercase<keyof typeof REACTIONS>;

interface ReactionCounts {
  like: number;
  helpful: number;
  insightful: number;
  inspiring: number;
}

interface UseReactionsReturn {
  reactionCounts: ReactionCounts;
  userReactions: ReactionType[];
  loading: boolean;
  toggleReaction: (reactionType: ReactionType) => Promise<void>;
  hasReacted: (reactionType: ReactionType) => boolean;
  getTotalReactions: () => number;
}

// ユーザーセッションID生成（匿名ユーザー用） - SSR安全
function generateSessionId(): string {
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  if (!isBrowser) {
    // SSR中は一時ID（保存しない）
    return 'session_ssr';
  }
  const existingId = localStorage.getItem('user_session_id');
  if (existingId) return existingId;
  const newId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('user_session_id', newId);
  return newId;
}

export function useReactions(blogId: string): UseReactionsReturn {
  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>({
    like: 0,
    helpful: 0,
    insightful: 0,
    inspiring: 0
  });
  
  const [userReactions, setUserReactions] = useState<ReactionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useState(() => generateSessionId());

  // 初期化: リアクション状態とカウントを取得
  useEffect(() => {
    loadReactions();
  }, [blogId, userId]);

  const loadReactions = async () => {
    if (!db) {
      // Firebase未初期化時はLocalStorageから復元
      loadFromLocalStorage();
      return;
    }
    
    try {
      setLoading(true);
      
      // 1. ブログ統計からカウント取得
      const statsDoc = await getDoc(doc(db, COLLECTIONS.BLOG_STATS, blogId));
      if (statsDoc.exists()) {
        const stats = statsDoc.data() as BlogStats;
        setReactionCounts(stats.reactionCounts);
      }
      
      // 2. ユーザーのリアクション状態取得
      const reactionsRef = collection(db, COLLECTIONS.REACTIONS);
      const q = query(
        reactionsRef, 
        where('userId', '==', userId),
        where('blogId', '==', blogId)
      );
      
      const querySnapshot = await getDocs(q);
      const userReactionTypes = querySnapshot.docs.map(doc => 
        (doc.data() as Reaction).reactionType
      );
      
      setUserReactions(userReactionTypes);
      
      // LocalStorage と同期
      syncToLocalStorage(userReactionTypes, reactionCounts);
      
    } catch (error) {
      console.error('Error loading reactions:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const toggleReaction = async (reactionType: ReactionType) => {
    if (!db) {
      // Firebase未初期化時はLocalStorageのみで動作
      toggleReactionLocalOnly(reactionType);
      return;
    }

    setLoading(true);
    const hasCurrentReaction = userReactions.includes(reactionType);
    
    try {
      if (hasCurrentReaction) {
        // リアクション削除
        await removeReaction(reactionType);
      } else {
        // リアクション追加
        await addReaction(reactionType);
      }
      
      // 統計更新
      await updateReactionStats(reactionType, hasCurrentReaction ? -1 : 1);
      
      // ローカル状態更新
      await loadReactions();
      
    } catch (error) {
      console.error('Error toggling reaction:', error);
      
      // エラー時はローカルのみで処理
      toggleReactionLocalOnly(reactionType);
    } finally {
      setLoading(false);
    }
  };

  const addReaction = async (reactionType: ReactionType) => {
    const reactionsRef = collection(db, COLLECTIONS.REACTIONS);
    
    // 重複チェック
    const existingQuery = query(
      reactionsRef,
      where('userId', '==', userId),
      where('blogId', '==', blogId),
      where('reactionType', '==', reactionType)
    );
    
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty) {
      return; // すでに存在する場合は何もしない
    }

    // リアクション追加
    const newReaction: Omit<Reaction, 'id'> = {
      userId,
      blogId,
      reactionType,
      createdAt: Timestamp.now()
    };
    
    await addDoc(reactionsRef, newReaction);
  };

  const removeReaction = async (reactionType: ReactionType) => {
    const reactionsRef = collection(db, COLLECTIONS.REACTIONS);
    const q = query(
      reactionsRef,
      where('userId', '==', userId),
      where('blogId', '==', blogId),
      where('reactionType', '==', reactionType)
    );
    
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  };

  const updateReactionStats = async (reactionType: ReactionType, countChange: number) => {
    const statsRef = doc(db, COLLECTIONS.BLOG_STATS, blogId);
    
    await runTransaction(db, async (transaction) => {
      const statsDoc = await transaction.get(statsRef);
      
      if (statsDoc.exists()) {
        const currentData = statsDoc.data() as BlogStats;
        const currentCount = currentData.reactionCounts?.[reactionType] || 0;
        const newCount = Math.max(0, currentCount + countChange);
        
        transaction.update(statsRef, {
          [`reactionCounts.${reactionType}`]: newCount,
          lastUpdated: Timestamp.now()
        });
      } else {
        // 新規統計作成
        const newStats: BlogStats = {
          blogId,
          bookmarkCount: 0,
          viewCount: 0,
          reactionCounts: {
            like: reactionType === 'like' ? Math.max(0, countChange) : 0,
            helpful: reactionType === 'helpful' ? Math.max(0, countChange) : 0,
            insightful: reactionType === 'insightful' ? Math.max(0, countChange) : 0,
            inspiring: reactionType === 'inspiring' ? Math.max(0, countChange) : 0
          },
          lastUpdated: Timestamp.now()
        };
        
        transaction.set(statsRef, newStats);
      }
    });
  };

  // LocalStorage ベースのフォールバック機能
  const toggleReactionLocalOnly = (reactionType: ReactionType) => {
    const storageKey = `reactions_${userId}`;
    const blogReactionsKey = `${storageKey}_${blogId}`;
    
    const currentReactions = JSON.parse(localStorage.getItem(blogReactionsKey) || '[]');
    const hasReaction = currentReactions.includes(reactionType);
    
    let newReactions;
    let newCounts = { ...reactionCounts };
    
    if (hasReaction) {
      // 削除
      newReactions = currentReactions.filter((r: string) => r !== reactionType);
      newCounts[reactionType] = Math.max(0, newCounts[reactionType] - 1);
    } else {
      // 追加
      newReactions = [...currentReactions, reactionType];
      newCounts[reactionType] = newCounts[reactionType] + 1;
    }
    
    localStorage.setItem(blogReactionsKey, JSON.stringify(newReactions));
    setUserReactions(newReactions);
    setReactionCounts(newCounts);
  };

  const loadFromLocalStorage = () => {
    const blogReactionsKey = `reactions_${userId}_${blogId}`;
    const countsKey = `reaction_counts_${blogId}`;
    
    const storedReactions = JSON.parse(localStorage.getItem(blogReactionsKey) || '[]');
    const storedCounts = JSON.parse(localStorage.getItem(countsKey) || JSON.stringify(reactionCounts));
    
    setUserReactions(storedReactions);
    setReactionCounts(storedCounts);
  };

  const syncToLocalStorage = (reactions: ReactionType[], counts: ReactionCounts) => {
    const blogReactionsKey = `reactions_${userId}_${blogId}`;
    const countsKey = `reaction_counts_${blogId}`;
    
    localStorage.setItem(blogReactionsKey, JSON.stringify(reactions));
    localStorage.setItem(countsKey, JSON.stringify(counts));
  };

  const hasReacted = (reactionType: ReactionType): boolean => {
    return userReactions.includes(reactionType);
  };

  const getTotalReactions = (): number => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  };

  return {
    reactionCounts,
    userReactions,
    loading,
    toggleReaction,
    hasReacted,
    getTotalReactions
  };
}