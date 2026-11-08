import type { APIRoute } from 'astro';

// Deleting a legacy CMS entry must not delete data for a Markdown article.
const retired: APIRoute = () =>
  new Response(
    JSON.stringify({
      error:
        'Blog articles are now managed in Git. This webhook has been retired.',
    }),
    { status: 410, headers: { 'Content-Type': 'application/json' } }
  );

export const GET = retired;
export const POST = retired;
