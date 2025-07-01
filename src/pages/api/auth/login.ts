import type { APIRoute } from "astro";

const clientId = import.meta.env.GITHUB_CLIENT_ID;
const redirectUri = `${import.meta.env.SITE_URL}/api/auth/callback`;
const state = Math.random().toString(36).substring(2);

export const GET: APIRoute = async () => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=read:user`;
  return new Response(null, {
    status: 302,
    headers: { Location: githubAuthUrl },
  });
};
