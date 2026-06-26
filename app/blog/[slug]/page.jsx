import { notFound } from 'next/navigation';
import Link from 'next/link';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { buildMetadata } from '@/lib/seo';
import { getAllBlogs, getBlogBySlug } from '@/lib/blogStore';
import ArticleActions from '@/components/ArticleActions';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs">${hljs.highlight(code, { language: lang }).value}</code></pre>`;
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(code)}</code></pre>`;
  },
});

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const blogs = await getAllBlogs();
    return blogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) {
    return buildMetadata({ title: '文章未找到', path: `/blog/${params.slug}` });
  }
  return buildMetadata({
    title: blog.title,
    description: blog.excerpt || blog.content?.slice(0, 80),
    keywords: blog.tags,
    path: `/blog/${blog.slug}`,
  });
}

export default async function BlogDetailPage({ params }) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) {
    notFound();
  }

  // 去掉 Markdown 中以 # 开头的主标题行（避免与页面 h1 重复）
  const contentWithoutH1 = (blog.content || '').replace(/^#\s+.+\n+/, '');
  const html = md.render(contentWithoutH1);

  // 获取上一篇和下一篇
  const allBlogs = await getAllBlogs();
  const sortedBlogs = allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentIndex = sortedBlogs.findIndex((b) => b.slug === blog.slug);
  const prevBlog = currentIndex > 0 ? sortedBlogs[currentIndex - 1] : null;
  const nextBlog = currentIndex < sortedBlogs.length - 1 ? sortedBlogs[currentIndex + 1] : null;

  // 相关文章（排除当前，最多3篇，优先同标签）
  const relatedBlogs = sortedBlogs
    .filter((b) => b.slug !== blog.slug)
    .sort((a, b) => {
      const aOverlap = (a.tags || []).filter((t) => (blog.tags || []).includes(t)).length;
      const bOverlap = (b.tags || []).filter((t) => (blog.tags || []).includes(t)).length;
      return bOverlap - aOverlap;
    })
    .slice(0, 3);

  return (
    <article className="blog-detail">
      {/* 返回链接 */}
      <Link href="/blog" className="blog-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        返回博客列表
      </Link>

      {/* 文章头部 */}
      <header className="blog-detail-header">
        <h1>{blog.title}</h1>
        <div className="blog-detail-meta">
          <span className="meta-date">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {new Date(blog.date).toLocaleDateString('zh-CN', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
          <span className="meta-dot" />
          <span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }}>
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            约 {Math.ceil((blog.content || '').length / 400)} 分钟阅读
          </span>
        </div>
        {(blog.tags || []).length > 0 && (
          <div className="blog-detail-tags">
            {blog.tags.map((t, i) => (
              <span key={t} className="tag" style={{ animationDelay: `${i * 0.1}s` }}>{t}</span>
            ))}
          </div>
        )}
      </header>

      {/* 正文内容 */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* 文章结尾区域 */}
      <div className="blog-end-section">
        {/* 作者卡片 */}
        <div className="author-card">
          <div className="author-avatar">辉</div>
          <div className="author-info">
            <h4>文辉</h4>
            <p>
              独立创作者，一人公司实践者。从大厂技术岗裸辞，用文字记录从0到1的创业过程。
              相信写作是最具复利的投资，持续分享真实经验与思考。
            </p>
          </div>
        </div>

        {/* 分享按钮 */}
        <ArticleActions title={blog.title} slug={blog.slug} />

        {/* 上一篇 / 下一篇 */}
        {(prevBlog || nextBlog) && (
          <nav className="article-nav">
            {prevBlog ? (
              <Link href={`/blog/${prevBlog.slug}`} className="article-nav-link article-nav-link--prev">
                <div className="article-nav-label">← 上一篇</div>
                <div className="article-nav-title">{prevBlog.title}</div>
              </Link>
            ) : <div />}
            {nextBlog ? (
              <Link href={`/blog/${nextBlog.slug}`} className="article-nav-link article-nav-link--next">
                <div className="article-nav-label">下一篇 →</div>
                <div className="article-nav-title">{nextBlog.title}</div>
              </Link>
            ) : <div />}
          </nav>
        )}

        {/* 相关推荐 */}
        {relatedBlogs.length > 0 && (
          <div className="related-posts">
            <h3>📖 相关推荐</h3>
            <div className="related-grid">
              {relatedBlogs.map((rb) => (
                <Link key={rb.slug} href={`/blog/${rb.slug}`} className="related-card">
                  <h4>{rb.title}</h4>
                  <span className="related-date">
                    {new Date(rb.date).toLocaleDateString('zh-CN')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 评论区 */}
        <div className="comments-section">
          <h3>
            💬 评论
            <span className="comment-count">0 条评论</span>
          </h3>

          {/* 评论输入框 */}
          <div className="comment-form">
            <div className="comment-avatar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0" />
              </svg>
            </div>
            <div className="comment-input-wrap">
              <textarea
                className="comment-input"
                placeholder="写下你的想法..."
                rows={3}
              />
              <button className="comment-submit">发布评论</button>
            </div>
          </div>

          {/* 评论列表（静态示例） */}
          <div className="comment-list">
            <div className="comment-item" style={{ animationDelay: '0.1s' }}>
              <div className="comment-avatar" style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff' }}>李</div>
              <div className="comment-body">
                <div className="comment-author">李同学</div>
                <div className="comment-time">2026-06-15</div>
                <div className="comment-text">
                  看了月报很有共鸣！我也在做一人公司，第一个月收入也是0，但看到你的记录感觉不那么孤单了。加油！
                </div>
                <button className="comment-reply-btn">回复</button>
              </div>
            </div>
            <div className="comment-item" style={{ animationDelay: '0.2s' }}>
              <div className="comment-avatar" style={{ background: 'linear-gradient(135deg, #0ea5a9, #2dd4bf)', color: '#fff' }}>张</div>
              <div className="comment-body">
                <div className="comment-author">张创作者</div>
                <div className="comment-time">2026-06-18</div>
                <div className="comment-text">
                  写作节奏那篇文章对我帮助很大。&ldquo;先完成再完美&rdquo;这句话我已经贴在桌上了。期待下一篇写作方法！
                </div>
                <button className="comment-reply-btn">回复</button>
              </div>
            </div>
            <div className="comment-item" style={{ animationDelay: '0.3s' }}>
              <div className="comment-avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff' }}>王</div>
              <div className="comment-body">
                <div className="comment-author">王同学</div>
                <div className="comment-time">2026-06-22</div>
                <div className="comment-text">
                  工具推荐很实用！特别是 Notion + Obsidian 的组合，我也在用。想请教一下你是怎么把两个工具配合使用的？
                </div>
                <button className="comment-reply-btn">回复</button>
              </div>
            </div>
          </div>
        </div>

        {/* 订阅 CTA */}
        <div className="subscribe-cta">
          <h3>📬 订阅我的 Newsletter</h3>
          <p>每周一封邮件，分享一人公司的真实进展、写作方法和工具推荐。</p>
          <div className="subscribe-form">
            <input
              type="email"
              className="subscribe-input"
              placeholder="输入你的邮箱地址"
            />
            <button className="subscribe-btn">立即订阅</button>
          </div>
        </div>
      </div>
    </article>
  );
}
