/**
 * Share Buttons - ソーシャルシェアボタンモジュール
 * blog/[id].astro のシェアボタン（X, LinkedIn, コピー）を制御する
 */

function showShareToast(message: string): void {
  const el = document.createElement('div');
  el.className = 'share-toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

export function setupShareButtons(): void {
  const pageUrl = window.location.href;
  const title = document.title || '';

  const xBtn = document.getElementById('share-x');
  const liBtn = document.getElementById('share-linkedin');
  const copyBtn = document.getElementById('share-copy');
  const canWebShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  if (xBtn) {
    xBtn.onclick = (e) => {
      e.preventDefault();
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`;
      window.open(url, '_blank', 'noopener');
    };
  }

  if (liBtn) {
    liBtn.onclick = (e) => {
      e.preventDefault();
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
      window.open(url, '_blank', 'noopener');
    };
  }

  if (copyBtn) {
    copyBtn.onclick = async (e) => {
      e.preventDefault();
      if (canWebShare) {
        try {
          await navigator.share({ title, url: pageUrl });
          showShareToast('共有ダイアログを開きました');
          return;
        } catch {
          // User cancelled or share failed, fall through to clipboard
        }
      }
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(pageUrl);
        } else {
          const ta = document.createElement('textarea');
          ta.value = pageUrl;
          ta.style.position = 'fixed';
          ta.style.top = '-1000px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        showShareToast('リンクをコピーしました');
        copyBtn.classList.add('tip-show');
        setTimeout(() => copyBtn.classList.remove('tip-show'), 1200);
      } catch {
        showShareToast('コピーに失敗しました');
      }
    };
  }
}
