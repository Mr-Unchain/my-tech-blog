/**
 * OGP情報取得ユーティリティ
 *
 * 指定したURLからOpen Graph Protocol情報を取得する
 * ビルド時に使用（サーバーサイドのみ）
 */

import * as cheerio from 'cheerio';

/**
 * OGP情報の型定義
 */
export interface OGPData {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  favicon: string;
}

/**
 * キャッシュ（ビルド中のメモリキャッシュ）
 */
const ogpCache = new Map<string, OGPData>();

/**
 * URLからOGP情報を取得
 * @param url 取得対象のURL
 * @returns OGP情報
 */
export async function fetchOGP(url: string): Promise<OGPData | null> {
  // キャッシュチェック
  if (ogpCache.has(url)) {
    return ogpCache.get(url)!;
  }

  try {
    // URLの検証
    const parsedUrl = new URL(url);

    // タイムアウト付きでフェッチ
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGPBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`OGP取得失敗: ${url} (${response.status})`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // OGP情報を抽出
    const ogpData: OGPData = {
      url,
      title:
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        $('title').text() ||
        '',
      description:
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '',
      image:
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        '',
      siteName:
        $('meta[property="og:site_name"]').attr('content') ||
        parsedUrl.hostname,
      favicon: getFaviconUrl(parsedUrl),
    };

    // 相対パスの画像URLを絶対パスに変換
    if (ogpData.image && !ogpData.image.startsWith('http')) {
      ogpData.image = new URL(ogpData.image, url).href;
    }

    // タイトルと説明を切り詰め
    ogpData.title = truncateText(ogpData.title, 100);
    ogpData.description = truncateText(ogpData.description, 150);

    // キャッシュに保存
    ogpCache.set(url, ogpData);

    return ogpData;
  } catch (error) {
    console.warn(`OGP取得エラー: ${url}`, error);
    return null;
  }
}

/**
 * ファビコンURLを取得
 */
function getFaviconUrl(parsedUrl: URL): string {
  // Google Favicon APIを使用（信頼性が高い）
  return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=32`;
}

/**
 * テキストを指定文字数で切り詰め
 */
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  text = text.trim().replace(/\s+/g, ' ');
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * URLがリンクカード対象かどうかを判定
 * （内部リンクや特定のドメインは除外）
 */
export function shouldCreateLinkCard(url: string, siteUrl?: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // 内部リンクは除外
    if (siteUrl) {
      const siteUrlParsed = new URL(siteUrl);
      if (parsedUrl.hostname === siteUrlParsed.hostname) {
        return false;
      }
    }

    // 画像や動画のダイレクトリンクは除外
    const pathname = parsedUrl.pathname.toLowerCase();
    if (/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|pdf)$/i.test(pathname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
