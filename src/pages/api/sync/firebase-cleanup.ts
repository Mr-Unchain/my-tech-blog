import type { APIRoute } from 'astro';

// Markdown is authoritative. The old CMS cleanup could delete valid article stats.
const retired: APIRoute = () =>
  new Response(
    JSON.stringify({
      error: 'This microCMS synchronization endpoint has been retired.',
    }),
    { status: 410, headers: { 'Content-Type': 'application/json' } }
  );

export const GET = retired;
export const POST = retired;
