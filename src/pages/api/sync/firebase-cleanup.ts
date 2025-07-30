// src/pages/api/sync/firebase-cleanup.ts
import type { APIRoute } from 'astro';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getBlogs } from '../../../lib/microcms';

// Firebase の views コレクションを microCMS と同期
export const POST: APIRoute = async ({ request }) => {
  try {
    // 認証チェック（簡易版）
    const authHeader = request.headers.get('authorization');
    const secretKey = import.meta.env.SYNC_SECRET_KEY;
    
    if (secretKey && authHeader !== `Bearer ${secretKey}`) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!db) {
      return new Response(JSON.stringify({ 
        error: 'Firebase not available' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('🔄 Firebase クリーンアップ処理開始');

    // 1. Firebase の views コレクションから全ドキュメントを取得
    const viewsCollectionRef = collection(db, 'views');
    const viewsSnapshot = await getDocs(viewsCollectionRef);
    const firebaseArticleIds = viewsSnapshot.docs.map(doc => doc.id);
    
    console.log('📊 Firebase views コレクション:', {
      total: firebaseArticleIds.length,
      ids: firebaseArticleIds
    });

    // 2. microCMS から全記事を取得
    const { contents: microCMSArticles } = await getBlogs({
      limit: 100 // 最大100件
    });
    const microCMSArticleIds = microCMSArticles.map((article: any) => article.id);
    
    console.log('📄 microCMS 記事:', {
      total: microCMSArticleIds.length,
      ids: microCMSArticleIds
    });

    // 3. Firebase にあるが microCMS にない記事ID を特定
    const orphanedIds = firebaseArticleIds.filter(id => 
      !microCMSArticleIds.includes(id)
    );
    
    console.log('🗑️ 削除対象の記事ID:', orphanedIds);

    // 4. 孤立したドキュメントを削除
    const deletionResults = [];
    for (const orphanedId of orphanedIds) {
      try {
        const docRef = doc(db, 'views', orphanedId);
        await deleteDoc(docRef);
        deletionResults.push({
          id: orphanedId,
          status: 'deleted',
          error: null
        });
        console.log(`✅ 削除完了: ${orphanedId}`);
      } catch (error) {
        deletionResults.push({
          id: orphanedId,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`❌ 削除エラー: ${orphanedId}`, error);
      }
    }

    const summary = {
      firebaseTotal: firebaseArticleIds.length,
      microCMSTotal: microCMSArticleIds.length,
      orphanedCount: orphanedIds.length,
      deletedCount: deletionResults.filter(r => r.status === 'deleted').length,
      errorCount: deletionResults.filter(r => r.status === 'error').length
    };

    console.log('📈 同期完了:', summary);

    return new Response(JSON.stringify({
      success: true,
      message: 'Firebase cleanup completed',
      summary,
      deletionResults,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ 同期処理エラー:', error);
    
    return new Response(JSON.stringify({
      error: 'Sync process failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// 動作確認用のGET
export const GET: APIRoute = async () => {
  if (!db) {
    return new Response(JSON.stringify({ 
      message: 'Firebase Cleanup API',
      status: 'Firebase not connected'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 簡易ステータスチェック
    const viewsCollectionRef = collection(db, 'views');
    const viewsSnapshot = await getDocs(viewsCollectionRef);
    
    const { contents: microCMSArticles } = await getBlogs({ limit: 10 });
    
    return new Response(JSON.stringify({
      message: 'Firebase Cleanup API',
      status: 'ready',
      firebase: {
        connected: true,
        viewsCount: viewsSnapshot.docs.length
      },
      microCMS: {
        connected: true,
        articlesCount: microCMSArticles.length
      },
      usage: {
        method: 'POST',
        auth: 'Bearer token required (SYNC_SECRET_KEY)',
        description: 'Synchronizes Firebase views collection with microCMS articles'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      message: 'Firebase Cleanup API',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};