// src/lib/microcms.ts
import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
} from "microcms-js-sdk";
import * as cheerio from "cheerio";
import { deepCopy, normalizeToArray } from "./utils";

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

export type Project = {
  id: string;
  title: string;
  summary?: string;
  role?: string;
  techStack?: string[];
  achievements?: string;
  period?: string;
  link?: string;
  thumbnail?: MicroCMSImage;
} & MicroCMSDate;

// GET 権限のみの API キーを使用することで、microCMS が下書き記事を自動的に除外して返す。
const readClient = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_READ_API_KEY,
});

// ブログ一覧を取得
export const getBlogs = async (queries?: MicroCMSQueries) => {
  const data = await readClient.get({
    endpoint: "blogs",
    queries,
  });

  // NOTE: microCMS SDKに起因する可能性のある、記事データ間での意図しない参照共有を
  // 防ぐため、取得した記事コンテンツをディープコピーして、参照を完全に断ち切ります。
  const contents = deepCopy(data.contents);

  // カテゴリフィールドを常に配列として扱うように正規化します。
  // これにより、スキーマが単数選択か複数選択かに関わらず、コンポーネント側で安定して処理できます。
  const shapedContents = contents.map((content: Blog) => ({
    ...content,
    category: normalizeToArray(content.category),
  }));

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
  return await readClient.get<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};

// ★★★ プロフィール情報を取得する関数を追加 ★★★
export const getProfile = async (queries?: MicroCMSQueries) => {
  return await readClient.get<Profile>({
    endpoint: "profile",
    queries,
  });
};

export const getProjects = async (queries?: MicroCMSQueries) => {
  const data = await readClient.get<{ contents: Project[] }>({
    endpoint: "projects",
    queries,
  });

  // NOTE: microCMS SDKに起因する可能性のある、プロジェクトデータ間での意図しない参照共有を
  // 防ぐため、取得したプロジェクトコンテンツをディープコピーして、参照を完全に断ち切ります。
  const contents = deepCopy(data.contents);

  // techStackフィールドを常に配列として扱うように正規化します。
  const shapedContents = contents.map((content: Project) => ({
    ...content,
    techStack: normalizeToArray(content.techStack),
  }));

  return {
    ...data,
    contents: shapedContents,
  };
};
