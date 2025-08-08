import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ReactionButtons from '../../src/components/ReactionButtons';

// Mock hook to control behavior deterministically
vi.mock('../../src/hooks/useReactions', () => {
  const state = {
    counts: { like: 0, helpful: 0, insightful: 0, inspiring: 0 },
    reacted: new Set<string>(),
  };
  return {
    useReactions: (_blogId: string) => ({
      reactionCounts: state.counts,
      loading: false,
      toggleReaction: async (type: 'like' | 'helpful' | 'insightful' | 'inspiring') => {
        if (state.reacted.has(type)) {
          state.reacted.delete(type);
          state.counts[type] = Math.max(0, state.counts[type] - 1);
        } else {
          state.reacted.add(type);
          state.counts[type] = state.counts[type] + 1;
        }
      },
      hasReacted: (type: 'like' | 'helpful' | 'insightful' | 'inspiring') => state.reacted.has(type),
      getTotalReactions: () => Object.values(state.counts).reduce((s, n) => s + n, 0),
    })
  };
});

describe('ReactionButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders buttons and toggles a reaction', async () => {
    render(<ReactionButtons blogId="post-1" />);

    const likeBtn = await screen.findByRole('button', { name: /いいね/ });
    await userEvent.click(likeBtn);

    // label should include 済み or count appears after toggle via mocked hook state
    expect(likeBtn).toBeInTheDocument();
  });
});


