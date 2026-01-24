import { useEffect, useState } from 'react';

/**
 * 見出しの型定義
 */
interface Heading {
  text: string;    // 見出しのテキスト
  id: string;      // 見出しのID（アンカーリンク用）
  tagName: string; // タグ名（h2, h3など）
}

/**
 * 目次コンポーネントのProps
 */
interface TableOfContentsProps {
  headings: Heading[];
}

/**
 * スクロール連動の現在位置ハイライト機能付き目次コンポーネント
 *
 * 機能:
 * - Intersection Observer APIを使用して現在読んでいるセクションを検出
 * - 現在のセクションの目次項目をハイライト表示
 * - クリックでスムーズスクロール
 */
export default function TableOfContents({ headings }: TableOfContentsProps) {
  // 現在アクティブな見出しのIDを管理
  const [activeId, setActiveId] = useState<string>('');

  /**
   * Intersection Observerによる見出し監視
   * 画面内に表示されている見出しを検出し、アクティブ状態を更新
   */
  useEffect(() => {
    if (headings.length === 0) return;

    // Observerのオプション設定
    // rootMargin: 上部80px、下部70%を除外して中央付近を監視領域とする
    const observerOptions: IntersectionObserverInit = {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    };

    // 見出しが画面内に入った時のコールバック
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // 表示されている見出しをフィルタリング
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // 最も上にある見出しを選択
        const topEntry = visibleEntries.reduce((prev, curr) => {
          return prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr;
        });
        setActiveId(topEntry.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 全ての見出しを監視対象に追加
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    // クリーンアップ: コンポーネントのアンマウント時に監視を解除
    return () => {
      observer.disconnect();
    };
  }, [headings]);

  /**
   * スクロールイベントによる補完的なアクティブ状態更新
   * 上方向へのスクロール時や画面最上部での状態管理を担当
   */
  useEffect(() => {
    if (headings.length === 0) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 画面最上部付近ではアクティブ状態をクリア
      if (currentScrollY < 100) {
        setActiveId('');
        lastScrollY = currentScrollY;
        return;
      }

      // 上方向へのスクロール時、ビューポート上部に最も近い見出しを検出
      if (currentScrollY < lastScrollY) {
        const headingElements = headings
          .map((h) => ({ id: h.id, element: document.getElementById(h.id) }))
          .filter((h) => h.element !== null);

        // 下から順に見出しをチェックし、ビューポート上部より上にあるものを探す
        for (let i = headingElements.length - 1; i >= 0; i--) {
          const element = headingElements[i].element;
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top < 150) {
              setActiveId(headingElements[i].id);
              break;
            }
          }
        }
      }

      lastScrollY = currentScrollY;
    };

    // パッシブリスナーとして登録（スクロールパフォーマンス向上）
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  /**
   * 目次項目クリック時のスムーズスクロール処理
   * @param e - クリックイベント
   * @param id - スクロール先の見出しID
   */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // ヘッダーの高さを考慮したオフセット
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // UX向上のため、クリック時に即座にアクティブ状態を更新
      setActiveId(id);
    }
  };

  // 見出しがない場合は何も表示しない
  if (headings.length === 0) {
    return null;
  }

  return (
    <ul className="toc-list">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={`${heading.tagName === 'h2' ? 'toc-h2' : 'toc-h3'}${
            activeId === heading.id ? ' toc-active' : ''
          }`}
        >
          <a href={`#${heading.id}`} onClick={(e) => handleClick(e, heading.id)}>
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
