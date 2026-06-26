'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogForm from '@/components/admin/BlogForm';
import { adminGetBlog, adminUpdateBlog } from '@/lib/adminApi';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await adminGetBlog(slug);
        if (alive) setBlog(data);
      } catch (err) {
        if (alive) setError(err.message || '加载失败');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const onSubmit = async (data) => {
    await adminUpdateBlog(slug, data);
    router.push('/admin/blogs');
  };

  if (loading) {
    return <p className="admin-empty">加载中…</p>;
  }
  if (error) {
    return (
      <>
        <header className="admin-page-header">
          <h1>编辑文章</h1>
        </header>
        <p className="admin-empty admin-error">{error}</p>
        <p>
          <Link href="/admin/blogs" className="admin-btn-ghost">← 返回列表</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <header className="admin-page-header">
        <h1>编辑文章</h1>
        <p>修改后保存即生效</p>
      </header>
      <BlogForm
        initial={blog}
        onSubmit={onSubmit}
        submitText="保存修改"
        backHref="/admin/blogs"
      />
    </>
  );
}
