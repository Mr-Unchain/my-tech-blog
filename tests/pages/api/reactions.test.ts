import { describe, it, expect, vi } from 'vitest';
import { POST, GET } from '../../../src/pages/api/reactions/[blogId]';

vi.mock('../../../src/lib/firebase', () => ({ db: null }));

describe('API /api/reactions/[blogId]', () => {
  it('POST returns 503 when Firebase not initialized', async () => {
    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ userId: 'u1', reactionType: 'like' }) });
    // @ts-expect-error simplified context
    const res = await POST({ request: req, params: { blogId: 'b1' } });
    expect(res.status).toBe(503);
  });

  it('GET returns default payload when Firebase not available', async () => {
    const url = new URL('http://localhost/api/reactions/b1?userId=u1');
    // @ts-expect-error simplified context
    const res = await GET({ params: { blogId: 'b1' }, url });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('reactionCounts');
    expect(json).toHaveProperty('userReactions');
  });
});


