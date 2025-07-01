import React, { useEffect, useState } from "react";
import type { Blog } from "../lib/microcms";

interface AdminDashboardProps {
  blogs: Blog[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ blogs: initialBlogs }) => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [loading] = useState(false);
  const [error] = useState("");

  // microCMSのAPIには直接削除やステータス更新はできないため、ダミー関数でUIのみ更新
  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    setBlogs(blogs.filter((b) => b.id !== id));
  };

  const handleToggleStatus = async (
    id: string,
    status: "PUBLISHED" | "DRAFT"
  ) => {
    setBlogs(
      blogs.map((b) =>
        b.id === id
          ? { ...b, status: status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }
          : b
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">管理ダッシュボード</h1>
      <a
        href="/admin/create"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mb-6 inline-block"
      >
        新規記事作成
      </a>
      {loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">タイトル</th>
              <th className="p-2">カテゴリ</th>
              <th className="p-2">公開日</th>
              <th className="p-2">状態</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-t">
                <td className="p-2">{blog.title}</td>
                <td className="p-2">{blog.category?.join(", ")}</td>
                <td className="p-2">
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString("ja-JP")
                    : blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("ja-JP")
                    : blog.updatedAt
                    ? new Date(blog.updatedAt).toLocaleDateString("ja-JP")
                    : "-"}
                </td>
                <td className="p-2">-</td>
                <td className="p-2 space-x-2">
                  <a
                    href={`/admin/edit/${blog.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </a>
                  {/* microCMS API仕様上、公開/下書き切替は未対応 */}
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
