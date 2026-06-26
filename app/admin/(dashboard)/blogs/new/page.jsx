'use client';

import { useRouter } from 'next/navigation';
import BlogForm from '@/components/admin/BlogForm';
import { adminCreateBlog } from '@/lib/adminApi';

export default function NewBlogPage() {
  const router = useRouter();

  const onSubmit = async (data) => {
    const created = await adminCreateBlog(data);
    // 保存成功后跳到列表
    router.push('/admin/blogs');
    return created;
  };

  return (
    <>
      <header className="admin-page-header">
        <h1>新建文章</h1>
      </header>
      <BlogForm onSubmit={onSubmit} submitText="发布" />
    </>
  );
}
