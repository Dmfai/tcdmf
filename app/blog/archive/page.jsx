import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getBlogs } from '@/lib/api';

export const metadata = buildMetadata({
  title: '归档',
  description: '按时间浏览所有博客。',
  path: '/blog/archive',
});

async function loadArchive() {
  try {
    const blogs = await getBlogs();
    // 按日期倒序
    return blogs
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    return [];
  }
}

export default async function BlogArchivePage() {
  const blogs = await loadArchive();

  return (
    <div className="container">
      <header className="page-header">
        <h1>归档</h1>
        <p>按时间倒序浏览所有文章。</p>
      </header>

      {blogs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '48px 0' }}>
          暂无文章。
        </p>
      ) : (
        <ul className="archive-list" style={{ paddingBottom: 80 }}>
          {blogs.map((b) => (
            <li key={b.slug}>
              <Link href={`/blog/${b.slug}`}>{b.title}</Link>
              <span className="archive-date">
                {new Date(b.date).toLocaleDateString('zh-CN')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
