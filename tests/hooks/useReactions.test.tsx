import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReactions } from '../../src/hooks/useReactions';

// Mock Firebase db to be null to trigger local storage branch
vi.mock('../../src/lib/firebase', () => ({ db: null }));

describe('useReactions (local fallback)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles reaction locally and updates counts', async () => {
    const { result } = renderHook(() => useReactions('post-1'));

    expect(result.current.getTotalReactions()).toBe(0);

    await act(async () => {
      await result.current.toggleReaction('like');
    });

    expect(result.current.hasReacted('like')).toBe(true);
    expect(result.current.reactionCounts.like).toBe(1);

    await act(async () => {
      await result.current.toggleReaction('like');
    });

    expect(result.current.hasReacted('like')).toBe(false);
    expect(result.current.reactionCounts.like).toBe(0);
  });
});


