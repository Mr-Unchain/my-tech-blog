// src/lib/utils.ts
// 共通ユーティリティ関数

/**
 * セッションID生成（匿名ユーザー用）
 * SSR環境でも安全に動作する
 */
export function generateSessionId(): string {
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  if (!isBrowser) {
    return 'session_ssr';
  }
  const existingId = localStorage.getItem('user_session_id');
  if (existingId) return existingId;
  const newId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('user_session_id', newId);
  return newId;
}

/**
 * 値を配列に正規化する
 * - 配列の場合: そのまま返す
 * - 文字列の場合: 単一要素の配列に変換
 * - undefined/null/空文字の場合: 空配列を返す
 */
export function normalizeToArray<T>(value: T | T[] | undefined | null): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value !== undefined && value !== null && value !== '') {
    return [value] as T[];
  }
  return [];
}

/**
 * オブジェクトのディープコピーを作成
 * 参照共有を防ぐために使用
 */
export function deepCopy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
