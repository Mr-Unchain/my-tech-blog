// src/components/ReactionButtons.tsx
import React, { useState } from 'react';
import { useReactions, type ReactionType } from '../hooks/useReactions';
import { REACTIONS } from '../lib/firebase-collections';

interface Props {
  blogId: string;
  className?: string;
  showCounts?: boolean;
  compact?: boolean;
}

export default function ReactionButtons({
  blogId,
  className = '',
  showCounts = true,
  compact = false
}: Props) {
  const { 
    reactionCounts, 
    loading, 
    toggleReaction, 
    hasReacted, 
    getTotalReactions 
  } = useReactions(blogId);
  
  const [animatingReaction, setAnimatingReaction] = useState<ReactionType | null>(null);

  const handleReactionClick = async (reactionType: ReactionType) => {
    if (loading) return;

    setAnimatingReaction(reactionType);
    
    try {
      await toggleReaction(reactionType);
    } catch (error) {
      console.error('Reaction toggle failed:', error);
    } finally {
      // アニメーション完了後にリセット
      setTimeout(() => {
        setAnimatingReaction(null);
      }, 600);
    }
  };

  // リアクションが全く無い場合は表示しない（オプション）
  const totalReactions = getTotalReactions();
  if (!showCounts && totalReactions === 0) {
    return null;
  }

  return (
    <div className={`reaction-buttons ${compact ? 'compact' : ''} ${className}`}>
      {Object.entries(REACTIONS).map(([reactionKey, reactionConfig]) => {
        const reactionType = reactionKey.toLowerCase() as ReactionType;
        const count = reactionCounts[reactionType] || 0;
        const isReacted = hasReacted(reactionType);
        const isAnimating = animatingReaction === reactionType;
        
        // コンパクトモードでカウント0の場合は非表示
        if (compact && count === 0 && !isReacted) {
          return null;
        }

        return (
          <button
            key={reactionType}
            onClick={() => handleReactionClick(reactionType)}
            disabled={loading}
            className={`reaction-btn ${reactionType} ${isReacted ? 'reacted' : ''} ${isAnimating ? 'animating' : ''}`}
            aria-label={`${reactionConfig.label} ${isReacted ? '済み' : ''} ${count > 0 ? `(${count})` : ''}`}
            title={`${reactionConfig.label}${isReacted ? ' - クリックで取り消し' : ''}`}
          >
            {/* リアクションエモート */}
            <span 
              className={`reaction-emoji ${isAnimating ? 'bounce' : ''}`}
              aria-hidden="true"
            >
              {reactionConfig.emoji}
            </span>

            {/* カウント表示 */}
            {showCounts && count > 0 && (
              <span className={`reaction-count ${isAnimating ? 'pulse' : ''}`}>
                {count}
              </span>
            )}

            {/* ローディングインジケーター */}
            {loading && animatingReaction === reactionType && (
              <div className="reaction-loading">
                <div className="loading-spinner" />
              </div>
            )}

            {/* リアクション追加時のエフェクト */}
            {isAnimating && (
              <div className="reaction-effect">
                <span className="effect-emoji">{reactionConfig.emoji}</span>
              </div>
            )}
          </button>
        );
      })}

      {/* 総リアクション数（オプション） */}
      {showCounts && totalReactions > 0 && !compact && (
        <div className="total-reactions">
          <span className="total-count">
            {totalReactions} reactions
          </span>
        </div>
      )}
    </div>
  );
}

// タイプ別リアクションボタン（個別使用）
export function SingleReactionButton({
  blogId,
  reactionType,
  className = ''
}: {
  blogId: string;
  reactionType: ReactionType;
  className?: string;
}) {
  const { reactionCounts, loading, toggleReaction, hasReacted } = useReactions(blogId);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const reactionConfig = REACTIONS[reactionType.toUpperCase() as keyof typeof REACTIONS];
  const count = reactionCounts[reactionType] || 0;
  const isReacted = hasReacted(reactionType);

  const handleClick = async () => {
    if (loading) return;
    
    setIsAnimating(true);
    
    try {
      await toggleReaction(reactionType);
    } catch (error) {
      console.error('Single reaction toggle failed:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`reaction-btn single ${reactionType} ${isReacted ? 'reacted' : ''} ${isAnimating ? 'animating' : ''} ${className}`}
      aria-label={`${reactionConfig.label} ${isReacted ? '済み' : ''} (${count})`}
    >
      <span className={`reaction-emoji ${isAnimating ? 'bounce' : ''}`}>
        {reactionConfig.emoji}
      </span>
      
      {count > 0 && (
        <span className={`reaction-count ${isAnimating ? 'pulse' : ''}`}>
          {count}
        </span>
      )}
      
      {isAnimating && (
        <div className="reaction-effect">
          <span className="effect-emoji">{reactionConfig.emoji}</span>
        </div>
      )}
    </button>
  );
}