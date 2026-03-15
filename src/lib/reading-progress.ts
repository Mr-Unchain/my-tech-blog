/**
 * Reading Progress - 読了プログレスバーモジュール
 * スクロール位置から記事の読了進捗を計算し、プログレスバーを更新する
 */

export function setupReadingProgress(): void {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  const article = document.querySelector('.blog-article-content');
  if (!article) return;

  function updateProgress(): void {
    const articleRect = article!.getBoundingClientRect();
    const articleTop = window.scrollY + articleRect.top;
    const articleHeight = articleRect.height;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    // 記事が画面に30%入ったところから開始、50%が残っているところで終了
    const readableStart = articleTop - windowHeight * 0.3;
    const readableEnd = articleTop + articleHeight - windowHeight * 0.5;
    const readableLength = readableEnd - readableStart;

    let progress = 0;
    if (scrollTop <= readableStart) {
      progress = 0;
    } else if (scrollTop >= readableEnd) {
      progress = 100;
    } else {
      progress = ((scrollTop - readableStart) / readableLength) * 100;
    }

    progressBar!.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}
