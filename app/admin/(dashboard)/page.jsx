'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminListBlogs, adminDeleteBlog } from '@/lib/adminApi';

export default function AdminDashboardPage() {
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

  const total = blogs.length;
  const latest = blogs[0];

  return (
    <>
      <header className="admin-page-header">
        <h1>仪表盘</h1>
        <p>欢迎回来，这里是工作室管理后台。</p>
      </header>

      {/* 概览卡片 */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-num">{total}</div>
          <div className="admin-stat-label">博客总数</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-num">
            {latest
              ? new Date(latest.date).toLocaleDateString('zh-CN')
              : '—'}
          </div>
          <div className="admin-stat-label">最近发布</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-num">
            <Link href="/admin/blogs/new" className="admin-stat-link">
              + 写新文章
            </Link>
          </div>
          <div className="admin-stat-label">快速操作</div>
        </div>
      </div>

      {/* 最近文章 */}
      <section className="admin-section">
        <header className="admin-section-header">
          <h2>最近文章</h2>
          <Link href="/admin/blogs" className="admin-btn-ghost">
            查看全部 →
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
            {blogs.slice(0, 5).map((b) => (
              <li key={b.slug} className="admin-list-item">
                <div className="admin-list-main">
                  <Link href={`/admin/blogs/${b.slug}/edit`} className="admin-list-title">
                    {b.title}
                  </Link>
                  <span className="admin-list-meta">
                    {new Date(b.date).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="admin-list-actions">
                  <Link
                    href={`/blog/${b.slug}`}
                    className="admin-btn-ghost"
                    target="_blank"
                  >
                    查看
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
      </section>
    </>
  );
}
