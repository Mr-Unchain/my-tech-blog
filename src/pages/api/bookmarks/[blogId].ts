// src/pages/api/bookmarks/[blogId].ts
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
import { COLLECTIONS, type Bookmark, type BlogStats } from '../../../lib/firebase-collections';

// ブックマーク追加/削除 API
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
    const { userId, action, metadata } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let result;
    
    if (action === 'add') {
      result = await addBookmark(blogId, userId, metadata);
    } else if (action === 'remove') {
      result = await removeBookmark(blogId, userId);
    } else {
      // トグル動作（デフォルト）
      result = await toggleBookmark(blogId, userId, metadata);
    }

    return new Response(
      JSON.stringify(result), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Bookmark API error:', error);
    
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

// ブックマーク状態取得 API
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
        isBookmarked: false, 
        bookmarkCount: 0, 
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

    let isBookmarked = false;
    
    // ユーザー固有のブックマーク状態確認
    if (userId) {
      const bookmarksRef = collection(db, COLLECTIONS.BOOKMARKS);
      const q = query(
        bookmarksRef, 
        where('userId', '==', userId),
        where('blogId', '==', blogId)
      );
      const querySnapshot = await getDocs(q);
      isBookmarked = !querySnapshot.empty;
    }

    return new Response(
      JSON.stringify({
        isBookmarked,
        bookmarkCount: stats?.bookmarkCount || 0,
        viewCount: stats?.viewCount || 0,
        lastUpdated: stats?.lastUpdated?.toDate().toISOString() || null
      }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Bookmark status API error:', error);
    
    return new Response(
      JSON.stringify({ 
        isBookmarked: false, 
        bookmarkCount: 0,
        error: 'Failed to fetch bookmark status'
      }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

// ヘルパー関数群
async function addBookmark(blogId: string, userId: string, metadata?: any) {
  const bookmarksRef = collection(db, COLLECTIONS.BOOKMARKS);
  
  // 重複チェック
  const existingQuery = query(
    bookmarksRef,
    where('userId', '==', userId),
    where('blogId', '==', blogId)
  );
  
  const existingDocs = await getDocs(existingQuery);
  if (!existingDocs.empty) {
    return { 
      success: true, 
      action: 'already_bookmarked',
      message: 'Already bookmarked' 
    };
  }

  // ブックマーク追加
  const newBookmark: Omit<Bookmark, 'id'> = {
    userId,
    blogId,
    createdAt: Timestamp.now(),
    metadata
  };
  
  const docRef = await addDoc(bookmarksRef, newBookmark);
  
  // 統計更新
  await updateBlogStats(blogId, 1);
  
  return { 
    success: true, 
    action: 'added',
    bookmarkId: docRef.id 
  };
}

async function removeBookmark(blogId: string, userId: string) {
  const bookmarksRef = collection(db, COLLECTIONS.BOOKMARKS);
  const q = query(
    bookmarksRef,
    where('userId', '==', userId),
    where('blogId', '==', blogId)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return { 
      success: true, 
      action: 'not_bookmarked',
      message: 'Bookmark not found' 
    };
  }

  // ブックマーク削除
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  
  // 統計更新
  await updateBlogStats(blogId, -1);
  
  return { 
    success: true, 
    action: 'removed',
    deletedCount: querySnapshot.docs.length
  };
}

async function toggleBookmark(blogId: string, userId: string, metadata?: any) {
  const bookmarksRef = collection(db, COLLECTIONS.BOOKMARKS);
  const q = query(
    bookmarksRef,
    where('userId', '==', userId),
    where('blogId', '==', blogId)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    // ブックマーク追加
    return await addBookmark(blogId, userId, metadata);
  } else {
    // ブックマーク削除
    return await removeBookmark(blogId, userId);
  }
}

async function updateBlogStats(blogId: string, countChange: number) {
  const statsRef = doc(db, COLLECTIONS.BLOG_STATS, blogId);
  
  await runTransaction(db, async (transaction) => {
    const statsDoc = await transaction.get(statsRef);
    
    if (statsDoc.exists()) {
      const currentData = statsDoc.data() as BlogStats;
      const newCount = Math.max(0, (currentData.bookmarkCount || 0) + countChange);
      
      transaction.update(statsRef, {
        bookmarkCount: newCount,
        lastUpdated: Timestamp.now()
      });
    } else {
      // 新規統計作成
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
}