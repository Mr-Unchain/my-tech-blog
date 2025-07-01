import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  cookies.delete('admin_auth', { path: '/' });
  return new Response(null, {
    status: 302,
    headers: { Location: '/login' },
  });
};
