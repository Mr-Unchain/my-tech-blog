import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookmarks } from '../../src/hooks/useBookmarks';

// Mock Firebase db to be null so LocalStorage path is used
vi.mock('../../src/lib/firebase', () => ({ db: null }));

describe('useBookmarks (local fallback)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates session id and toggles bookmarks locally when db is null', async () => {
    const { result } = renderHook(() => useBookmarks());

    // Initially empty
    expect(result.current.bookmarks).toEqual([]);

    await act(async () => {
      await result.current.toggleBookmark('blog-1', { title: 't', category: ['c'], eyecatch: '' });
    });

    expect(result.current.isBookmarked('blog-1')).toBe(true);

    await act(async () => {
      await result.current.toggleBookmark('blog-1');
    });

    expect(result.current.isBookmarked('blog-1')).toBe(false);
  });
});


