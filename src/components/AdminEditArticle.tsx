import React, { useEffect, useState } from 'react';
import MdEditor from '@uiw/react-md-editor';
import { getBlogDetail, createBlog } from '../lib/microcms';

interface Article {
  title: string;
  category: string;
  content: string;
  status: 'PUBLISHED' | 'DRAFT';
}

interface Props {
  id: string;
}

const AdminEditArticle: React.FC<Props> = ({ id }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await getBlogDetail(id);
        setArticle({
          title: data.title || '',
          category: Array.isArray(data.category) ? data.category.join(',') : data.category || '',
          content: data.content || '',
          status: 'DRAFT', // microCMSの仕様上、取得時はstatusがないためデフォルト値
        });
      } catch (e) {
        setMessage('記事の取得に失敗しました');
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!article) return;
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleContentChange = (value?: string) => {
    if (!article) return;
    setArticle({ ...article, content: value ?? '' });
  };

  const handleSubmit = async (status: 'PUBLISHED' | 'DRAFT') => {
    if (!article) return;
    setLoading(true);
    setMessage('');
    try {
      await createBlog({ ...article, status }); // microCMSのAPI制約でupdate不可の場合はここを修正
      setMessage(status === 'PUBLISHED' ? '更新・公開しました！' : '下書き保存しました！');
    } catch (e) {
      setMessage('保存に失敗しました');
    }
    setLoading(false);
  };

  if (loading) return <div>読み込み中...</div>;
  if (!article) return <div>記事が見つかりません</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">記事編集</h1>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <input
        type="text"
        name="title"
        value={article.title}
        onChange={handleInputChange}
        placeholder="タイトル"
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        name="category"
        value={article.category}
        onChange={handleInputChange}
        placeholder="カテゴリ（カンマ区切り可）"
        className="w-full mb-4 p-2 border rounded"
      />
      <MdEditor value={article.content} onChange={handleContentChange} />
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleSubmit('DRAFT')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={loading}
        >
          下書き保存
        </button>
        <button
          onClick={() => handleSubmit('PUBLISHED')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          公開
        </button>
      </div>
    </div>
  );
};

export default AdminEditArticle;
