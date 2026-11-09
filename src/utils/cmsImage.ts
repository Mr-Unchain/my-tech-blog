/** Let microCMS resize its own assets so rendering does not fetch them on the server. */
export function cmsImageUrl(source: string, width: number): string {
  try {
    const url = new URL(source);
    if (url.hostname !== 'images.microcms-assets.io') return source;
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', '70');
    return url.toString();
  } catch {
    return source;
  }
}
