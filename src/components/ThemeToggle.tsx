import { useState, useEffect } from 'react';
import { getTheme, toggleTheme, watchSystemTheme, type Theme } from '../lib/theme';

/**
 * テーマ切替トグルボタン（React Island）
 *
 * ライト/ダークテーマを切り替える。太陽/月アイコンで現在のテーマを表示し、
 * クリックで切替を行う。Header コンポーネントの右端に配置される。
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getTheme());

    const cleanup = watchSystemTheme((newTheme) => {
      setTheme(newTheme);
    });

    return cleanup;
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  // SSR/初回レンダリング時はプレースホルダーを表示（ハイドレーションミスマッチ防止）
  if (!mounted) {
    return (
      <button
        className="w-9 h-9 flex items-center justify-center rounded-lg opacity-0"
        aria-label="テーマ切替"
        disabled
        data-testid="theme-toggle-button"
      >
        <span className="w-5 h-5" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleToggle}
      className={[
        'w-9 h-9 flex items-center justify-center rounded-lg',
        'transition-all duration-200',
        'hover:bg-white/20 active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
      ].join(' ')}
      aria-label={isDark ? 'ライトテーマに切替' : 'ダークテーマに切替'}
      title={isDark ? 'ライトテーマに切替' : 'ダークテーマに切替'}
      data-testid="theme-toggle-button"
    >
      {isDark ? (
        // 太陽アイコン（ダークテーマ時 → ライトに切替）
        <svg
          className="w-5 h-5 text-yellow-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // 月アイコン（ライトテーマ時 → ダークに切替）
        <svg
          className="w-5 h-5 text-slate-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
