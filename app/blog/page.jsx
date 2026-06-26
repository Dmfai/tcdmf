import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getAllBlogs } from '@/lib/blogStore';
import { getAllMoments } from '@/lib/momentStore';

export const metadata = buildMetadata({
  title: '博客',
  description: '从0到1创业日志、写作方法、个人品牌实战 — 文辉工作室的真实记录。',
  path: '/blog',
});

export default async function BlogIndexPage() {
  const blogs = await getAllBlogs();
  const sortedBlogs = blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  const moments = await getAllMoments();

  // 统计标签
  const tagCount = {};
  blogs.forEach((b) => (b.tags || []).forEach((t) => {
    tagCount[t] = (tagCount[t] || 0) + 1;
  }));
  const allTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);

  return (
    <div className="container">
      {/* 页面头部 */}
      <header className="page-header">
        <h1>博客</h1>
        <p>从0到1创业日志 · 写作与表达方法 · 个人品牌实战 · 变现路径与作品化</p>
      </header>

      {/* 标签云 */}
      {allTags.length > 0 && (
        <div className="tag-cloud" style={{ justifyContent: 'center', paddingBottom: 0 }}>
          {allTags.map(([tag, count]) => (
            <span key={tag} className="tag" style={{
              fontSize: `${Math.min(14 + count * 2, 20)}px`,
              padding: `${Math.min(6 + count, 12)}px ${Math.min(14 + count * 2, 24)}px`,
            }}>
              {tag}
              <span style={{ marginLeft: 4, opacity: 0.5, fontSize: '0.85em' }}>{count}</span>
            </span>
          ))}
        </div>
      )}

      {blogs.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '64px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <p>第一篇文章正在路上，敬请期待。</p>
        </div>
      ) : (
        <>
          {/* 统计条 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            padding: '20px 0 8px',
            color: 'var(--color-text-muted)',
            fontSize: 14,
          }}>
            <span>📄 {blogs.length} 篇文章</span>
            <span>🏷️ {allTags.length} 个标签</span>
            <span>
              📅 {new Date(sortedBlogs[sortedBlogs.length - 1]?.date).toLocaleDateString('zh-CN')} — {new Date(sortedBlogs[0]?.date).toLocaleDateString('zh-CN')}
            </span>
          </div>

          <div className="blog-list">
            {sortedBlogs.map((b, idx) => (
              <Link key={b.slug} href={`/blog/${b.slug}`} className="card-link">
                <article className="card" style={{ animation: `fadeUp 0.5s ease ${idx * 0.08}s both` }}>
                  {/* 装饰色条 */}
                  <div style={{
                    height: 3,
                    background: [
                      'linear-gradient(90deg, var(--color-accent), var(--color-gold))',
                      'linear-gradient(90deg, var(--color-purple), var(--color-blue))',
                      'linear-gradient(90deg, var(--color-teal), var(--color-emerald))',
                      'linear-gradient(90deg, var(--color-blue), var(--color-accent))',
                      'linear-gradient(90deg, var(--color-gold), var(--color-purple))',
                    ][idx % 5],
                  }} />
                  <div className="card-body">
                    <h3 className="card-title">{b.title}</h3>
                    <p className="card-desc">{b.excerpt || b.content?.slice(0, 80) + '...'}</p>
                    <div className="card-tags">
                      {(b.tags || []).map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                    <div className="card-footer">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {new Date(b.date).toLocaleDateString('zh-CN')}
                        <span style={{ margin: '0 4px', opacity: 0.3 }}>·</span>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {Math.ceil((b.content || '').length / 400)} 分钟
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ========== 说说版块 ========== */}
      {moments.length > 0 && (
        <section className="moments-section">
          <div className="moments-section-header">
            <h2>💬 说说</h2>
            <p className="moments-section-sub">日常思考与碎片灵感 · 共 {moments.length} 条</p>
          </div>
          <div className="moments-timeline">
            {moments.map((m, idx) => (
              <article
                key={m._id}
                className="moment-card"
                style={{ animation: `fadeUp 0.5s ease ${idx * 0.06}s both` }}
              >
                {/* 左侧时间轴 */}
                <div className="moment-timeline-dot">
                  <div className="moment-dot" />
                  {idx < moments.length - 1 && <div className="moment-line" />}
                </div>
                {/* 右侧内容 */}
                <div className="moment-body">
                  <div className="moment-content" dangerouslySetInnerHTML={{ __html: m.content }} />
                  <div className="moment-meta">
                    <span className="moment-source">{m.source}</span>
                    <span className="moment-date">
                      {new Date(m.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      {' '}
                      {new Date(m.date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {(m.tags && m.tags.length > 0) && (
                    <div className="moment-tags">
                      {m.tags.map((t) => (
                        <span key={t} className="tag tag--sm">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 底部订阅 CTA */}
      <div className="subscribe-cta" style={{ marginBottom: 48 }}>
        <h3>📬 不错过任何一篇文章</h3>
        <p>订阅我的 Newsletter，每周收到最新文章和一人公司真实进展。</p>
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
  );
}
