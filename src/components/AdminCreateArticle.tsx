import MdEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import { createClient } from "microcms-js-sdk";

interface Article {
  title: string;
  category: string;
  content: string;
  description: string;
  eyecatch: string; // 画像URL
  status: "PUBLISHED" | "DRAFT";
}

interface AdminCreateArticleProps {
  serviceDomain: string;
  apiKey: string;
}

const AdminCreateArticle: React.FC<AdminCreateArticleProps> = ({ serviceDomain, apiKey }) => {
  const [article, setArticle] = useState<Article>({
    title: "",
    category: "",
    content: "",
    description: "",
    eyecatch: "",
    status: "DRAFT",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleContentChange = (value?: string) => {
    setArticle({ ...article, content: value ?? "" });
  };

  const handleSubmit = async (status: "PUBLISHED" | "DRAFT") => {
    setLoading(true);
    setMessage("");
    try {
      // クライアント側でcreateClientを生成
      const client = createClient({
        serviceDomain,
        apiKey,
      });
      const payload = {
        title: article.title,
        category: article.category
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
        content: article.content,
        description: article.description,
        eyecatch: article.eyecatch ? { url: article.eyecatch } : undefined,
        status,
      };
      console.log("送信データ", payload);
      await client.create({
        endpoint: "blogs",
        content: payload,
      });
      setMessage(
        status === "PUBLISHED" ? "公開しました！" : "下書き保存しました！"
      );
      setArticle({ title: "", category: "", content: "", description: "", eyecatch: "", status: "DRAFT" });
    } catch (e) {
      setMessage("保存に失敗しました");
    }
    setLoading(false);
  };

  return (
    <div className="note-form-container">
      <h2 className="note-form-title">新規記事作成</h2>
      {message && (
        <div className={`note-message ${message.includes('失敗') ? 'note-message-error' : 'note-message-success'}`}>{message}</div>
      )}
      <div className="note-form-group">
        <label className="note-form-label" htmlFor="title">タイトル</label>
        <input
          id="title"
          type="text"
          name="title"
          value={article.title}
          onChange={handleInputChange}
          placeholder="タイトルを入力"
          className="note-input"
        />
      </div>
      <div className="note-form-group">
        <label className="note-form-label" htmlFor="category">カテゴリ（カンマ区切り可）</label>
        <input
          id="category"
          type="text"
          name="category"
          value={article.category}
          onChange={handleInputChange}
          placeholder="例: 技術,日記"
          className="note-input"
        />
      </div>
      <div className="note-form-group">
        <label className="note-form-label" htmlFor="description">記事の説明文</label>
        <input
          id="description"
          type="text"
          name="description"
          value={article.description}
          onChange={handleInputChange}
          placeholder="記事の説明文"
          className="note-input"
        />
      </div>
      <div className="note-form-group">
        <label className="note-form-label" htmlFor="eyecatch">画像のURL</label>
        <input
          id="eyecatch"
          type="text"
          name="eyecatch"
          value={article.eyecatch}
          onChange={handleInputChange}
          placeholder="画像のURLを入力"
          className="note-input"
        />
        {article.eyecatch && (
          <img
            src={article.eyecatch}
            alt="アイキャッチ画像プレビュー"
            className="note-eyecatch-preview"
          />
        )}
      </div>
      <div className="note-form-group">
        <div className="note-md-label">本文（Markdown対応）</div>
        <div className="note-md-editor-custom">
          <MdEditor value={article.content} onChange={handleContentChange} height={"400px"} data-color-mode="light" />
        </div>
      </div>
      <div className="note-btn-row">
        <button
          onClick={() => handleSubmit("DRAFT")}
          className="note-btn note-btn-draft note-btn-custom"
          disabled={loading}
        >
          下書き保存
        </button>
        <button
          onClick={() => handleSubmit("PUBLISHED")}
          className="note-btn note-btn-publish note-btn-custom"
          disabled={loading}
        >
          公開
        </button>
      </div>
    </div>
  );
};

export default AdminCreateArticle;
