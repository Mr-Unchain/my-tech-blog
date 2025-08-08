import { describe, it, expect } from 'vitest';
import { calculateReadingTime, calculateReadingTimeSimple, getContentStats } from '../../src/utils/readingTime';

describe('readingTime utilities', () => {
  it('returns 1 minute for empty content', () => {
    const res = calculateReadingTime('');
    expect(res.minutes).toBe(1);
    expect(res.text).toContain('1分');
  });

  it('counts japanese chars, english words and images', () => {
    const html = '<p>テスト文章です。</p><p>Hello world example.</p><img src="/a.png" />';
    const res = calculateReadingTime(html, { wordsPerMinute: 400, includeImages: true, imageTime: 60 });
    // 1 image adds 1 minute
    expect(res.minutes).toBeGreaterThanOrEqual(2);
  });

  it('simple reading time delegates to calculateReadingTime', () => {
    const html = '<p>短い文章</p>';
    const minutes = calculateReadingTimeSimple(html);
    expect(typeof minutes).toBe('number');
    expect(minutes).toBeGreaterThan(0);
  });

  it('returns content stats including reading time', () => {
    const html = '<p>コード</p>\n<pre><code>const a = 1</code></pre>\n<a href="#">link</a>';
    const stats = getContentStats(html);
    expect(stats.totalCharacters).toBeGreaterThan(0);
    expect(stats.readingTime.minutes).toBeGreaterThan(0);
  });
});


