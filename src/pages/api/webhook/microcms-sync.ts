// src/pages/api/webhook/microcms-sync.ts
import type { APIRoute } from 'astro';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// microCMSからのWebhookペイロード型定義
interface MicroCMSWebhookPayload {
  service: string;
  api: string;
  id: string;
  type: 'new' | 'edit' | 'delete';
  contents?: {
    new?: any;
    old?: any;
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // リクエストヘッダーの検証
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // リクエストボディを一度だけ読み取り
    const rawBody = await request.text();
    let payload: MicroCMSWebhookPayload;
    
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Webhook署名の検証（セキュリティ）
    const signature = request.headers.get('x-microcms-signature');
    const webhookSecret = import.meta.env.MICROCMS_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      try {
        const crypto = await import('crypto');
        const expectedSignature = crypto.createHmac('sha256', webhookSecret)
          .update(rawBody)
          .digest('hex');
        if (`sha256=${expectedSignature}` !== signature) {
          return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch (cryptoError) {
        console.error('❌ 署名検証エラー:', cryptoError);
        // 署名検証に失敗した場合でも処理を続行（開発環境向け）
      }
    }
    
    console.log('🎣 microCMS Webhook受信:', {
      api: payload.api,
      type: payload.type,
      id: payload.id,
      service: payload.service
    });

    // ブログAPIの削除イベントのみ処理
    if (payload.api !== 'blogs' || payload.type !== 'delete') {
      console.log('ℹ️ 処理対象外のWebhook:', payload.type, payload.api);
      return new Response(JSON.stringify({ 
        message: 'Webhook received but not processed',
        reason: `API: ${payload.api}, Type: ${payload.type}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Firebaseが初期化されているかチェック
    if (!db) {
      console.error('❌ Firebase not initialized');
      return new Response(JSON.stringify({ 
        error: 'Firebase not available' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const articleId = payload.id;
    
    try {
      // Firestore の views コレクションから該当記事を削除
      const viewDocRef = doc(db, 'views', articleId);
      
      // ドキュメントが存在するかチェック
      const docSnapshot = await getDoc(viewDocRef);
      
      if (docSnapshot.exists()) {
        // ドキュメントを削除
        await deleteDoc(viewDocRef);
        console.log(`✅ Firebase views ドキュメント削除完了: ${articleId}`);
        
        return new Response(JSON.stringify({
          success: true,
          message: `Successfully deleted Firebase document for article: ${articleId}`,
          articleId: articleId,
          action: 'deleted'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        console.log(`ℹ️ Firebase views ドキュメントが存在しません: ${articleId}`);
        
        return new Response(JSON.stringify({
          success: true,
          message: `Firebase document not found for article: ${articleId}`,
          articleId: articleId,
          action: 'not_found'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
    } catch (firebaseError) {
      console.error('❌ Firebase操作エラー:', firebaseError);
      
      return new Response(JSON.stringify({
        error: 'Failed to delete Firebase document',
        details: firebaseError instanceof Error ? firebaseError.message : 'Unknown error',
        articleId: articleId
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Webhook処理エラー:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// GET リクエストでの動作確認用
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'microCMS Sync Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString(),
    firebase: db ? 'connected' : 'not_connected'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};