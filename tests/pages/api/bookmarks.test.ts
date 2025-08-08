import { describe, it, expect, vi } from 'vitest';
import { POST, GET } from '../../../src/pages/api/bookmarks/[blogId]';

// Mock firebase module surface to avoid real Firestore
vi.mock('../../../src/lib/firebase', () => ({ db: null }));

describe('API /api/bookmarks/[blogId]', () => {
  it('POST returns 503 when Firebase not initialized', async () => {
    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ userId: 'u1' }) });
    // @ts-expect-error simplified context
    const res = await POST({ request: req, params: { blogId: 'b1' } });
    expect(res.status).toBe(503);
  });

  it('GET returns default payload when Firebase not available', async () => {
    const url = new URL('http://localhost/api/bookmarks/b1?userId=u1');
    // @ts-expect-error simplified context
    const res = await GET({ params: { blogId: 'b1' }, url });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('bookmarkCount');
  });
});


