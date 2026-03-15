import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getTheme, setTheme, toggleTheme, watchSystemTheme, clearThemePreference } from '../theme';

// matchMedia のモック
function createMatchMediaMock(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn((_event: string, handler: (e: MediaQueryListEvent) => void) => {
      listeners.push(handler);
    }),
    removeEventListener: vi.fn((_event: string, handler: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    }),
    dispatchChange: (newMatches: boolean) => {
      listeners.forEach((fn) => fn({ matches: newMatches } as MediaQueryListEvent));
    },
  };
  return mql;
}

describe('theme.ts', () => {
  let mockMatchMedia: ReturnType<typeof createMatchMediaMock>;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    mockMatchMedia = createMatchMediaMock(false);
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mockMatchMedia));
  });

  describe('getTheme', () => {
    it('localStorage に値がなくシステムがライトの場合、light を返す', () => {
      expect(getTheme()).toBe('light');
    });

    it('localStorage に "dark" がある場合、dark を返す', () => {
      localStorage.setItem('theme', 'dark');
      expect(getTheme()).toBe('dark');
    });

    it('localStorage に "light" がある場合、light を返す', () => {
      localStorage.setItem('theme', 'light');
      expect(getTheme()).toBe('light');
    });

    it('localStorage に値がなくシステムがダークの場合、dark を返す', () => {
      mockMatchMedia = createMatchMediaMock(true);
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mockMatchMedia));
      expect(getTheme()).toBe('dark');
    });

    it('localStorage に不正な値がある場合、システム設定にフォールバック', () => {
      localStorage.setItem('theme', 'invalid');
      expect(getTheme()).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('dark を設定すると localStorage に保存され、html に class="dark" が追加される', () => {
      setTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('light を設定すると localStorage に保存され、html から class="dark" が削除される', () => {
      document.documentElement.classList.add('dark');
      setTheme('light');
      expect(localStorage.getItem('theme')).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('light → dark に切り替わる', () => {
      localStorage.setItem('theme', 'light');
      const result = toggleTheme();
      expect(result).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('dark → light に切り替わる', () => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      const result = toggleTheme();
      expect(result).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('watchSystemTheme', () => {
    it('手動選択がない場合、システムテーマ変更時にコールバックが呼ばれる', () => {
      const callback = vi.fn();
      watchSystemTheme(callback);

      mockMatchMedia.dispatchChange(true);
      expect(callback).toHaveBeenCalledWith('dark');
    });

    it('手動選択がある場合、システムテーマ変更時にコールバックが呼ばれない', () => {
      localStorage.setItem('theme', 'light');
      const callback = vi.fn();
      watchSystemTheme(callback);

      mockMatchMedia.dispatchChange(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('クリーンアップ関数でリスナーが解除される', () => {
      const callback = vi.fn();
      const cleanup = watchSystemTheme(callback);

      cleanup();
      expect(mockMatchMedia.removeEventListener).toHaveBeenCalled();
    });
  });

  describe('clearThemePreference', () => {
    it('localStorage の設定をクリアし、システム設定に戻す', () => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');

      clearThemePreference();
      expect(localStorage.getItem('theme')).toBeNull();
      // システムがライトの場合、dark クラスが削除される
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('システムがダークの場合、dark クラスが維持される', () => {
      localStorage.setItem('theme', 'light');
      mockMatchMedia = createMatchMediaMock(true);
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mockMatchMedia));

      clearThemePreference();
      expect(localStorage.getItem('theme')).toBeNull();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });
});
