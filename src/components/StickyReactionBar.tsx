/**
 * StickyReactionBar - 記事左側の固定リアクションバー
 *
 * Zenn.devを参考にした、記事の左側に表示されるスクロール追従型のリアクションバー
 *
 * 機能:
 * - いいねボタン（カウント表示）
 * - シェアボタン群（X、LinkedIn、リンクコピー）
 * - position: sticky で画面に固定
 * - モバイルでは非表示（lg以上で表示）
 */
import { useState } from 'react';
import { useReactions, type ReactionType } from '../hooks/useReactions';
import { REACTIONS } from '../lib/firebase-collections';

interface Props {
  blogId: string;
  title: string;
}

export default function StickyReactionBar({ blogId, title }: Props) {
  const { reactionCounts, loading, toggleReaction, hasReacted, getTotalReactions } =
    useReactions(blogId);
  const [animatingReaction, setAnimatingReaction] = useState<ReactionType | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  /**
   * リアクションボタンのクリックハンドラ
   */
  const handleReactionClick = async (reactionType: ReactionType) => {
    if (loading) return;

    setAnimatingReaction(reactionType);

    try {
      await toggleReaction(reactionType);
    } catch (error) {
      console.error('Reaction toggle failed:', error);
    } finally {
      setTimeout(() => {
        setAnimatingReaction(null);
      }, 600);
    }
  };

  /**
   * Xでシェア
   */
  const shareOnX = () => {
    const url = window.location.href;
    const text = encodeURIComponent(title);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener');
  };

  /**
   * LinkedInでシェア
   */
  const shareOnLinkedIn = () => {
    const url = window.location.href;
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener');
  };

  /**
   * リンクをコピー
   */
  const copyLink = async () => {
    const url = window.location.href;

    try {
      // モダンブラウザ用
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // フォールバック: テキストエリアを使用
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.top = '-1000px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // トースト表示
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // 総リアクション数を取得
  const totalReactions = getTotalReactions();

  return (
    <div className="sticky-reaction-bar">
      {/* リアクションボタン群 */}
      <div className="sticky-reaction-section">
        {Object.entries(REACTIONS).map(([reactionKey, reactionConfig]) => {
          const reactionType = reactionKey.toLowerCase() as ReactionType;
          const count = reactionCounts[reactionType] || 0;
          const isReacted = hasReacted(reactionType);
          const isAnimating = animatingReaction === reactionType;

          return (
            <button
              key={reactionType}
              onClick={() => handleReactionClick(reactionType)}
              disabled={loading}
              className={`sticky-reaction-btn ${reactionType} ${isReacted ? 'reacted' : ''} ${isAnimating ? 'animating' : ''}`}
              aria-label={`${reactionConfig.label} ${isReacted ? '済み' : ''} ${count > 0 ? `(${count})` : ''}`}
              title={`${reactionConfig.label}${isReacted ? ' - クリックで取り消し' : ''}`}
            >
              <span className={`sticky-reaction-emoji ${isAnimating ? 'bounce' : ''}`}>
                {reactionConfig.emoji}
              </span>
              {count > 0 && <span className="sticky-reaction-count">{count}</span>}
            </button>
          );
        })}

        {/* 総リアクション数 */}
        {totalReactions > 0 && (
          <div className="sticky-total-reactions">
            <span>{totalReactions}</span>
          </div>
        )}
      </div>

      {/* 区切り線 */}
      <div className="sticky-divider" />

      {/* シェアボタン群 */}
      <div className="sticky-share-section">
        {/* Xでシェア */}
        <button
          onClick={shareOnX}
          className="sticky-share-btn twitter"
          aria-label="Xでシェア"
          title="Xでシェア"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="sticky-share-icon">
            <path d="M18.9 2H22l-7.7 8.8L23.5 22H16l-5.2-6.8L4.8 22H2l8.3-9.5L.7 2h7l4.7 6.2L18.9 2z" />
          </svg>
        </button>

        {/* LinkedInでシェア */}
        <button
          onClick={shareOnLinkedIn}
          className="sticky-share-btn linkedin"
          aria-label="LinkedInでシェア"
          title="LinkedInでシェア"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="sticky-share-icon">
            <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M8.34 17.34V10.5H6V17.34H8.34M7.17 9.41A1.41 1.41 0 1 0 7.17 6.59 1.41 1.41 0 0 0 7.17 9.41M18 17.34V13.61C18 11.5 16.88 10.41 15.19 10.41A3 3 0 0 0 12.88 11.65H12.84V10.5H10.5V17.34H12.88V13.98C12.88 13 13.06 12.08 14.22 12.08C15.36 12.08 15.38 13.12 15.38 14.04V17.34H18Z" />
          </svg>
        </button>

        {/* リンクをコピー */}
        <button
          onClick={copyLink}
          className="sticky-share-btn copy"
          aria-label="リンクをコピー"
          title="リンクをコピー"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="sticky-share-icon">
            <path d="M19 21H8V7H19M19 3H7A2 2 0 0 0 5 5V19A2 2 0 0 0 7 21H19A2 2 0 0 0 21 19V5A2 2 0 0 0 19 3M3 17V3H17V1H3A2 2 0 0 0 1 3V17H3Z" />
          </svg>
        </button>
      </div>

      {/* コピー完了トースト */}
      {showCopyToast && <div className="sticky-copy-toast">コピーしました</div>}
    </div>
  );
}
