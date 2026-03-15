/**
 * Search History - 検索履歴サジェストモジュール
 * First View の検索フォームに過去の検索履歴をサジェストとして表示する
 */

const STORAGE_KEY = 'search_history';
const MAX_HISTORY = 20;

function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '[]';
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function setHistory(arr: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, MAX_HISTORY)));
  } catch {
    // localStorage unavailable
  }
}

export function initializeSearchHistory(): void {
  const form = document.getElementById('fv-search') as HTMLFormElement | null;
  const input = document.getElementById('fv-q') as HTMLInputElement | null;
  const datalist = document.getElementById('fv-suggest');
  const history = getHistory();

  if (datalist && Array.isArray(history)) {
    datalist.innerHTML = history.map((h) => `<option value="${h}"></option>`).join('');
  }

  form?.addEventListener('submit', () => {
    const q = (input?.value || '').trim();
    if (!q) return;
    const h = getHistory();
    const next = [q, ...h.filter((x: string) => x !== q)];
    setHistory(next);
  });
}
