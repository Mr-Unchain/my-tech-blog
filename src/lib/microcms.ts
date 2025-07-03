// src/lib/microcms.ts
import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
} from "microcms-js-sdk";

// ブログ記事の型定義
export type Blog = {
  id: string;
  title: string;
  description: string;
  content: string;
  eyecatch: MicroCMSImage;
  category: string[]; // セレクトフィールドは文字列の配列になります
} & MicroCMSDate;

// ★★★ プロフィールの型定義を拡張 ★★★
export type Profile = {
  name: string;
  description: string;
  avatar: MicroCMSImage;
  xUrl?: string;
  githubUrl?: string;
  // ここから下を追加
  portfolio_introduction?: string;
  portfolio_intro?: string; // microCMSスキーマ用
  skills?: string;
  work_history?: string;
  contact_email?: string;
} & MicroCMSDate;

// SSR用: API取得用のクライアントを作成
const serverClient = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.VITE_MICROCMS_API_KEY,
});

// ブログ一覧を取得
export const getBlogs = async (queries?: MicroCMSQueries) => {
  const data = await serverClient.get({
    endpoint: "blogs",
    queries,
  });

  // NOTE: microCMS SDKに起因する可能性のある、記事データ間での意図しない参照共有を
  // 防ぐため、取得した記事コンテンツをディープコピーして、参照を完全に断ち切ります。
  const contents = JSON.parse(JSON.stringify(data.contents));

  // カテゴリフィールドを常に配列として扱うように正規化します。
  // これにより、スキーマが単数選択か複数選択かに関わらず、コンポーネント側で安定して処理できます。
  const shapedContents = contents.map((content: any) => {
    const originalCategory = content.category;
    let newCategory = [];

    if (Array.isArray(originalCategory)) {
      newCategory = originalCategory;
    } else if (typeof originalCategory === "string" && originalCategory) {
      newCategory = [originalCategory];
    }

    return {
      ...content,
      category: newCategory,
    };
  });

  return {
    ...data,
    contents: shapedContents,
  };
};

// ブログの詳細を取得
export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return await serverClient.get<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};

// ★★★ プロフィール情報を取得する関数を追加 ★★★
export const getProfile = async (queries?: MicroCMSQueries) => {
  return await serverClient.get<Profile>({
    endpoint: "profile",
    queries,
  });
};

/**
 * 新規記事をmicroCMSに作成
 * @param article 記事データ
 */
export async function createBlog(article: {
  title: string;
  category: string;
  content: string;
  status: "PUBLISHED" | "DRAFT";
}) {
  const endpoint = import.meta.env.VITE_MICROCMS_API_URL || "";
  const apiKey = import.meta.env.VITE_MICROCMS_API_KEY || "";
  const res = await fetch(`${endpoint}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      title: article.title,
      category: article.category.split(",").map((c) => c.trim()),
      content: article.content,
      status: article.status,
    }),
  });
  if (!res.ok) throw new Error("記事の作成に失敗しました");
  return await res.json();
}
