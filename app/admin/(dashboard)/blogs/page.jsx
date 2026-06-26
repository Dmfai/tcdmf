'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminListBlogs, adminDeleteBlog } from '@/lib/adminApi';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await adminListBlogs();
      setBlogs(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (slug, title) => {
    if (!confirm(`确认删除《${title}》？此操作不可恢复。`)) return;
    try {
      await adminDeleteBlog(slug);
      setBlogs((arr) => arr.filter((b) => b.slug !== slug));
    } catch (err) {
      alert(err.message || '删除失败');
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>博客管理</h1>
          <p>共 {blogs.length} 篇文章</p>
        </div>
        <Link href="/admin/blogs/new" className="admin-btn-primary">
          + 新建文章
        </Link>
      </header>

      {loading ? (
        <p className="admin-empty">加载中…</p>
      ) : error ? (
        <p className="admin-empty admin-error">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="admin-empty">
          还没有文章，
          <Link href="/admin/blogs/new">写第一篇</Link>
          吧。
        </p>
      ) : (
        <ul className="admin-list">
          {blogs.map((b) => (
            <li key={b.slug} className="admin-list-item">
              <div className="admin-list-main">
                <Link
                  href={`/admin/blogs/${b.slug}/edit`}
                  className="admin-list-title"
                >
                  {b.title}
                </Link>
                <div className="admin-list-meta">
                  {new Date(b.date).toLocaleDateString('zh-CN')}
                  {(b.tags || []).map((t) => (
                    <span key={t} className="admin-tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="admin-list-actions">
                <Link
                  href={`/blog/${b.slug}`}
                  className="admin-btn-ghost"
                  target="_blank"
                >
                  查看
                </Link>
                <Link
                  href={`/admin/blogs/${b.slug}/edit`}
                  className="admin-btn-ghost"
                >
                  编辑
                </Link>
                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={() => onDelete(b.slug, b.title)}
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
