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

// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// ブログ一覧を取得
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.get<{ contents: Blog[] }>({
    endpoint: "blogs",
    queries,
  });
};

// ブログの詳細を取得
export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return await client.get<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};

// getCategories関数は不要になったので削除します。
