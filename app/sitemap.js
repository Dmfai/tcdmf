import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';
import Portfolio from '@/models/Portfolio';
import { SITE_URL } from '@/config/env';

/**
 * 动态 sitemap：包含静态页面 + 所有博客 + 所有作品
 * Next.js 会自动挂载到 /sitemap.xml
 */
export default async function sitemap() {
  const now = new Date().toISOString();

  const staticEntries = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/services', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/portfolio', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/blog', priority: 0.9, changeFrequency: 'daily' },
    { url: '/blog/tags', priority: 0.5, changeFrequency: 'weekly' },
    { url: '/blog/archive', priority: 0.5, changeFrequency: 'weekly' },
  ].map((e) => ({
    url: `${SITE_URL}${e.url}`,
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));

  let blogEntries = [];
  let portfolioEntries = [];

  try {
    await connectDB();
    const blogs = await Blog.find().select('slug date').lean();
    blogEntries = blogs.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.date ? new Date(b.date).toISOString() : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const portfolios = await Portfolio.find().select('slug date').lean();
    portfolioEntries = portfolios.map((p) => ({
      url: `${SITE_URL}/portfolio/${p.slug}`,
      lastModified: p.date ? new Date(p.date).toISOString() : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // 数据库不可用时仅返回静态条目
  }

  return [...staticEntries, ...blogEntries, ...portfolioEntries];
}
