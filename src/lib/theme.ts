/**
 * Theme Service - クライアントサイドのテーマ管理
 *
 * localStorage → prefers-color-scheme → 'light' の優先順でテーマを判定し、
 * <html> 要素の class="dark" で Tailwind CSS のダークモードを制御する。
 */

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const isBrowser = typeof window !== 'undefined';

/**
 * 現在のテーマを取得する。
 * 優先順: localStorage > prefers-color-scheme > 'light'
 */
export function getTheme(): Theme {
  if (!isBrowser) return 'light';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * テーマを設定する。
 * localStorage に保存し、<html> の class を更新する。
 */
export function setTheme(theme: Theme): void {
  if (!isBrowser) return;

  localStorage.setItem(STORAGE_KEY, theme);
  applyThemeToDOM(theme);
}

/**
 * テーマをトグルする。
 * @returns 切替後のテーマ
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * システムテーマ(prefers-color-scheme)の変更を監視する。
 * ユーザーが手動選択していない場合のみコールバックを実行する。
 * @returns クリーンアップ関数
 */
export function watchSystemTheme(callback: (theme: Theme) => void): () => void {
  if (!isBrowser) return () => {};

  const mql = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    // ユーザーが手動で選択している場合はシステム変更を無視
    if (localStorage.getItem(STORAGE_KEY)) return;

    const systemTheme: Theme = e.matches ? 'dark' : 'light';
    applyThemeToDOM(systemTheme);
    callback(systemTheme);
  };

  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}

/**
 * localStorage のテーマ設定をクリアし、システム設定に戻す。
 */
export function clearThemePreference(): void {
  if (!isBrowser) return;

  localStorage.removeItem(STORAGE_KEY);
  const systemTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  applyThemeToDOM(systemTheme);
}

/**
 * <html> 要素に テーマクラスを適用する（内部ヘルパー）。
 */
function applyThemeToDOM(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
