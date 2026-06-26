import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getBlogs } from '@/lib/api';

export const metadata = buildMetadata({
  title: '标签',
  description: '按标签浏览博客。',
  path: '/blog/tags',
});

async function loadTags() {
  try {
    const blogs = await getBlogs();
    const set = new Set();
    blogs.forEach((b) => (b.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  } catch {
    return [];
  }
}

export default async function BlogTagsPage() {
  const tags = await loadTags();

  return (
    <div className="container">
      <header className="page-header">
        <h1>标签</h1>
        <p>按主题浏览所有文章。</p>
      </header>

      {tags.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '48px 0' }}>
          暂无标签。
        </p>
      ) : (
        <div className="tag-cloud" style={{ justifyContent: 'center', paddingBottom: 80 }}>
          {tags.map((t) => (
            <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="tag">
              #{t}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
