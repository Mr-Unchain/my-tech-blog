import type { APIRoute } from "astro";

const clientId = import.meta.env.GITHUB_CLIENT_ID;
const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;
const allowedUser = import.meta.env.GITHUB_ALLOWED_USER;

export const GET: APIRoute = async ({ url, cookies }) => {
  const code = url.searchParams.get("code");
  if (!code) {
    return Response.redirect("/login-failed?reason=code", 302);
  }

  // GitHubからアクセストークン取得
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;
  if (!accessToken) {
    return Response.redirect("/login-failed?reason=token", 302);
  }

  // GitHubユーザー情報取得
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `token ${accessToken}` },
  });
  const user = await userRes.json();
  if (!user || !user.login) {
    return Response.redirect("/login-failed?reason=user", 302);
  }

  // 許可ユーザー以外は403
  if (user.login !== allowedUser) {
    return Response.redirect("/login-failed?reason=forbidden", 302);
  }

  // セッション用cookie発行
  cookies.set("admin_auth", accessToken, {
    path: "/",
    httpOnly: true,
    secure: false, // 開発環境ではfalse、本番ではtrueに変更
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1週間
  });

  // ダッシュボードへリダイレクト
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin/dashboard" },
  });
};
