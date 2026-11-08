import { afterEach, describe, expect, it, vi } from 'vitest';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('microcms-js-sdk', () => ({ createClient: () => ({ get }) }));
import { getProfile, getProjects } from '../../src/lib/microcms';

afterEach(() => {
  vi.restoreAllMocks();
  get.mockReset();
});

describe('CMS profile and projects', () => {
  it('retains the existing CMS profile lookup', async () => {
    get.mockResolvedValue({ name: 'Oliva', skills: '<p>TypeScript</p>' });
    expect(await getProfile()).toMatchObject({ name: 'Oliva' });
    expect(get).toHaveBeenCalledWith({
      endpoint: 'profile',
      queries: undefined,
    });
  });
  it('returns a nullable profile without logging API error details', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    get.mockRejectedValue(new Error('private-upstream-detail'));
    expect(await getProfile()).toBeNull();
    expect(warn.mock.calls.flat().join(' ')).not.toContain(
      'private-upstream-detail'
    );
  });
  it('marks failed project retrieval unavailable and preserves successful data', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    get.mockRejectedValueOnce(new Error('offline'));
    expect(await getProjects()).toMatchObject({
      available: false,
      contents: [],
    });
    get.mockResolvedValueOnce({
      contents: [{ id: 'one', techStack: 'Astro' }],
      totalCount: 1,
    });
    expect(await getProjects()).toMatchObject({
      available: true,
      contents: [{ id: 'one', techStack: ['Astro'] }],
    });
  });
});
