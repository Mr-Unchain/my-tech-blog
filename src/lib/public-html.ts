import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { isIP } from 'node:net';

export const isPublicAddress = (address: string): boolean => {
  if (isIP(address) === 4) {
    const [a, b] = address.split('.').map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 168 || b === 0)) ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  if (isIP(address) === 6) {
    return (
      /^[23]/i.test(address) && !address.toLowerCase().startsWith('2001:db8:')
    );
  }
  return false;
};

export const publicHttpsUrl = (input: string, base?: string): URL | null => {
  try {
    const url = new URL(input, base);
    const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      (url.port && url.port !== '443')
    )
      return null;
    if (!host.includes('.') && !isIP(host)) return null;
    if (
      host === 'localhost' ||
      /\.(localhost|local|internal|test|invalid)$/.test(host)
    )
      return null;
    if (isIP(host) && !isPublicAddress(host)) return null;
    return url;
  } catch {
    return null;
  }
};

// Build-time metadata only. Validate every redirect and pin DNS to the checked IP.
export async function fetchPublicHtml(
  input: string,
  redirects = 0
): Promise<{ html: string; url: string }> {
  const url = publicHttpsUrl(input);
  if (!url || redirects > 3) throw new Error('Unsupported preview URL.');
  const addresses = await lookup(url.hostname, { all: true });
  if (
    !addresses.length ||
    addresses.some(({ address }) => !isPublicAddress(address))
  )
    throw new Error('Non-public preview address.');
  const address = addresses[0];
  const response = await new Promise<{ html: string; location?: string }>(
    (resolve, reject) => {
      const req = request(
        url,
        {
          method: 'GET',
          family: address.family,
          lookup: (_host, _options, callback) =>
            callback(null, address.address, address.family),
          headers: {
            'User-Agent': 'Monologger-LinkPreview/1.0',
            Accept: 'text/html,application/xhtml+xml',
            'Accept-Encoding': 'identity',
          },
        },
        (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            res.resume();
            resolve({ html: '', location: res.headers.location });
            return;
          }
          if (
            res.statusCode !== 200 ||
            !/text\/html|application\/xhtml\+xml/.test(
              res.headers['content-type'] ?? ''
            )
          ) {
            res.resume();
            reject(new Error('Preview metadata is unavailable.'));
            return;
          }
          let size = 0;
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => {
            size += chunk.length;
            if (size > 1024 * 1024)
              req.destroy(
                new Error('Preview metadata exceeds its size limit.')
              );
            else chunks.push(chunk);
          });
          res.on('end', () =>
            resolve({ html: Buffer.concat(chunks).toString('utf8') })
          );
          res.on('error', reject);
        }
      );
      const timer = setTimeout(
        () => req.destroy(new Error('Preview metadata timed out.')),
        3500
      );
      req.on('close', () => clearTimeout(timer));
      req.on('error', reject);
      req.end();
    }
  );
  if (response.location)
    return fetchPublicHtml(new URL(response.location, url).href, redirects + 1);
  return { html: response.html, url: url.href };
}
