import { describe, it, expect, vi } from 'vitest';
import { getBlogs } from '../../src/lib/microcms';

// Mock microcms-js-sdk createClient
vi.mock('microcms-js-sdk', () => {
  return {
    createClient: () => ({
      get: async () => ({
        contents: [
          { id: 'a', title: 't', description: '', content: '', eyecatch: { url: '' }, category: 'JS' },
          { id: 'b', title: 't2', description: '', content: '', eyecatch: { url: '' }, category: ['TS', 'Astro'] },
        ],
      })
    })
  };
});

describe('microcms lib', () => {
  it('normalizes category to array in getBlogs', async () => {
    const data = await getBlogs();
    const cats1 = data.contents[0].category;
    const cats2 = data.contents[1].category;
    expect(Array.isArray(cats1)).toBe(true);
    expect(Array.isArray(cats2)).toBe(true);
  });
});


