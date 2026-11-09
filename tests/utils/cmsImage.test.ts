import { describe, expect, it } from 'vitest';
import { cmsImageUrl } from '../../src/utils/cmsImage';

describe('cmsImageUrl', () => {
  it('replaces existing microCMS size parameters and keeps other parameters', () => {
    const url = cmsImageUrl('https://images.microcms-assets.io/assets/example.png?w=256&fit=crop', 400);
    expect(url).toBe('https://images.microcms-assets.io/assets/example.png?w=400&fit=crop&q=70');
  });

  it('leaves local and non-microCMS URLs untouched', () => {
    expect(cmsImageUrl('/placeholder.svg', 400)).toBe('/placeholder.svg');
    expect(cmsImageUrl('https://example.com/image.png', 400)).toBe('https://example.com/image.png');
  });
});
