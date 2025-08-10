// Simple LQIP/blur generator using canvas for remote images
// Note: Runs at build time (SSR) to generate a tiny base64 placeholder
export async function generateBlurDataURL(imageUrl: string, width = 16): Promise<string | null> {
  try {
    const res = await fetch(`${imageUrl}?w=${width}&q=10`);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const b64 = Buffer.from(buf).toString('base64');
    // Assume jpeg as a default; microCMS delivers web images
    return `data:image/jpeg;base64,${b64}`;
  } catch {
    return null;
  }
}


