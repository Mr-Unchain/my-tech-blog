// src/pages/api/reactions/[blogId].ts
import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
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
import { COLLECTIONS, REACTIONS, type Reaction, type BlogStats } from '../../../lib/firebase-collections';

type ReactionType = 'like' | 'helpful' | 'insightful' | 'inspiring';

// リアクション追加/削除 API
export const POST: APIRoute = async ({ request, params }) => {
  const { blogId } = params;
  
  if (!blogId) {
    return new Response(
      JSON.stringify({ error: 'blogId is required' }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!db) {
    return new Response(
      JSON.stringify({ error: 'Firebase not initialized' }), 
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { userId, reactionType, action } = body;

    if (!userId || !reactionType) {
      return new Response(
        JSON.stringify({ error: 'userId and reactionType are required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // リアクションタイプのバリデーション
    const validReactionTypes = ['like', 'helpful', 'insightful', 'inspiring'];
    if (!validReactionTypes.includes(reactionType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid reaction type' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let result;
    
    if (action === 'add') {
      result = await addReaction(blogId, userId, reactionType);
    } else if (action === 'remove') {
      result = await removeReaction(blogId, userId, reactionType);
    } else {
      // トグル動作（デフォルト）
      result = await toggleReaction(blogId, userId, reactionType);
    }

    return new Response(
      JSON.stringify(result), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Reaction API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

// リアクション状態取得 API
export const GET: APIRoute = async ({ params, url }) => {
  const { blogId } = params;
  const userId = url.searchParams.get('userId');
  
  if (!blogId) {
    return new Response(
      JSON.stringify({ error: 'blogId is required' }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!db) {
    return new Response(
      JSON.stringify({ 
        reactionCounts: { like: 0, helpful: 0, insightful: 0, inspiring: 0 },
        userReactions: [],
        error: 'Firebase not available' 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // ブログ統計取得
    const statsRef = doc(db, COLLECTIONS.BLOG_STATS, blogId);
    const statsDoc = await getDoc(statsRef);
    const stats = statsDoc.exists() ? statsDoc.data() as BlogStats : null;

    const reactionCounts = stats?.reactionCounts || {
      like: 0,
      helpful: 0,
      insightful: 0,
      inspiring: 0
    };

    let userReactions: string[] = [];
    
    // ユーザー固有のリアクション状態確認
    if (userId) {
      const reactionsRef = collection(db, COLLECTIONS.REACTIONS);
      const q = query(
        reactionsRef, 
        where('userId', '==', userId),
        where('blogId', '==', blogId)
      );
      const querySnapshot = await getDocs(q);
      userReactions = querySnapshot.docs.map(doc => 
        (doc.data() as Reaction).reactionType
      );
    }

    const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);

    return new Response(
      JSON.stringify({
        reactionCounts,
        userReactions,
        totalReactions,
        lastUpdated: stats?.lastUpdated?.toDate().toISOString() || null
      }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Reaction status API error:', error);
    
    return new Response(
      JSON.stringify({ 
        reactionCounts: { like: 0, helpful: 0, insightful: 0, inspiring: 0 },
        userReactions: [],
        totalReactions: 0,
        error: 'Failed to fetch reaction status'
      }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

// ヘルパー関数群
async function addReaction(blogId: string, userId: string, reactionType: ReactionType) {
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
    return { 
      success: true, 
      action: 'already_reacted',
      message: 'Already reacted with this type' 
    };
  }

  // リアクション追加
  const newReaction: Omit<Reaction, 'id'> = {
    userId,
    blogId,
    reactionType,
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(reactionsRef, newReaction);
  
  // 統計更新
  await updateReactionStats(blogId, reactionType, 1);
  
  return { 
    success: true, 
    action: 'added',
    reactionId: docRef.id,
    reactionType
  };
}

async function removeReaction(blogId: string, userId: string, reactionType: ReactionType) {
  const reactionsRef = collection(db, COLLECTIONS.REACTIONS);
  const q = query(
    reactionsRef,
    where('userId', '==', userId),
    where('blogId', '==', blogId),
    where('reactionType', '==', reactionType)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return { 
      success: true, 
      action: 'not_reacted',
      message: 'Reaction not found' 
    };
  }

  // リアクション削除
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  
  // 統計更新
  await updateReactionStats(blogId, reactionType, -1);
  
  return { 
    success: true, 
    action: 'removed',
    deletedCount: querySnapshot.docs.length,
    reactionType
  };
}

async function toggleReaction(blogId: string, userId: string, reactionType: ReactionType) {
  const reactionsRef = collection(db, COLLECTIONS.REACTIONS);
  const q = query(
    reactionsRef,
    where('userId', '==', userId),
    where('blogId', '==', blogId),
    where('reactionType', '==', reactionType)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    // リアクション追加
    return await addReaction(blogId, userId, reactionType);
  } else {
    // リアクション削除
    return await removeReaction(blogId, userId, reactionType);
  }
}

async function updateReactionStats(blogId: string, reactionType: ReactionType, countChange: number) {
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
}