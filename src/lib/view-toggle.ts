/**
 * View Toggle - グリッド/リスト表示切替モジュール
 * index.astro の記事一覧の表示モードを制御する
 */

const STORAGE_KEY = 'article_view_mode';

type ViewMode = 'grid' | 'list';

function updateButtonStyles(
  gridButton: HTMLElement | null,
  listButton: HTMLElement | null,
  view: ViewMode
): void {
  const isGrid = view === 'grid';

  if (isGrid) {
    gridButton?.classList.remove('text-slate-400');
    gridButton?.classList.add('text-cyan-400', 'border-cyan-400', 'bg-slate-700');
  } else {
    gridButton?.classList.remove('text-cyan-400', 'border-cyan-400', 'bg-slate-700');
    gridButton?.classList.add('text-slate-400');
  }

  if (!isGrid) {
    listButton?.classList.remove('text-slate-400');
    listButton?.classList.add('text-cyan-400', 'border-cyan-400', 'bg-slate-700');
  } else {
    listButton?.classList.remove('text-cyan-400', 'border-cyan-400', 'bg-slate-700');
    listButton?.classList.add('text-slate-400');
  }
}

function setView(
  container: HTMLElement | null,
  gridButton: HTMLElement | null,
  listButton: HTMLElement | null,
  view: ViewMode
): void {
  if (!container) return;
  const cards = container.querySelectorAll('.article-card');

  cards.forEach((card) => {
    card.classList.remove('animate-fade-in', 'animate-fade-out');
  });

  container.style.opacity = '0.7';
  container.style.transform = 'translateY(10px)';

  setTimeout(() => {
    if (view === 'list') {
      container.classList.remove('grid', 'md:grid-cols-2', 'xl:grid-cols-3', 'gap-6', 'md:gap-8');
      container.classList.add('flex', 'flex-col', 'gap-4', 'md:gap-6');
      cards.forEach((card) => {
        card.classList.add('list-view');
        (card as HTMLElement).style.width = '100%';
      });
    } else {
      container.classList.remove('flex', 'flex-col', 'gap-4', 'md:gap-6');
      container.classList.add('grid', 'md:grid-cols-2', 'xl:grid-cols-3', 'gap-6', 'md:gap-8');
      cards.forEach((card) => {
        card.classList.remove('list-view');
        (card as HTMLElement).style.width = '';
      });
    }

    requestAnimationFrame(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    });
  }, 150);

  updateButtonStyles(gridButton, listButton, view);
  localStorage.setItem(STORAGE_KEY, view);
}

export function initializeViewToggle(): void {
  const gridButton = document.getElementById('view-grid');
  const listButton = document.getElementById('view-list');
  const container = document.getElementById('article-list-container');

  gridButton?.addEventListener('click', () => setView(container, gridButton, listButton, 'grid'));
  listButton?.addEventListener('click', () => setView(container, gridButton, listButton, 'list'));

  const savedView = localStorage.getItem(STORAGE_KEY);
  setView(container, gridButton, listButton, savedView === 'list' ? 'list' : 'grid');
}
