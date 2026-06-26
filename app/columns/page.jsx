import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getAllColumns } from '@/lib/columnStore';

export const metadata = buildMetadata({
  title: '专栏',
  description: '按主题分类的深度内容合集——从创业日志到写作方法，从品牌实战到效率工具。',
  path: '/columns',
});

const gradientPairs = [
  ['#e94560', '#f97316'],
  ['#7c3aed', '#3b82f6'],
  ['#0ea5a9', '#10b981'],
  ['#3b82f6', '#e94560'],
  ['#f97316', '#7c3aed'],
  ['#10b981', '#0ea5a9'],
  ['#e94560', '#7c3aed'],
  ['#3b82f6', '#0ea5a9'],
  ['#f97316', '#10b981'],
  ['#7c3aed', '#e94560'],
];

export default async function ColumnsPage() {
  const columns = await getAllColumns();

  return (
    <div className="container">
      {/* 页面头部 */}
      <header className="page-header">
        <h1>📚 专栏</h1>
        <p>按主题分类的深度内容合集，系统化阅读，专题式学习</p>
      </header>

      {/* 统计条 */}
      {columns.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          padding: '8px 0 32px',
          color: 'var(--color-text-muted)',
          fontSize: 14,
        }}>
          <span>📚 {columns.length} 个专栏</span>
          <span>
            📄 {columns.reduce((sum, c) => sum + (c.articleCount || c.articles?.length || 0), 0)} 篇文章
          </span>
          <span>
            📅 {new Date(columns[columns.length - 1]?.date).toLocaleDateString('zh-CN')} — {new Date(columns[0]?.date).toLocaleDateString('zh-CN')}
          </span>
        </div>
      )}

      {columns.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '64px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <p>专栏正在筹备中，敬请期待。</p>
        </div>
      ) : (
        <div className="columns-grid">
          {columns.map((col, idx) => {
            const [c1, c2] = gradientPairs[idx % gradientPairs.length];
            return (
              <article
                key={col._id}
                className="column-card"
                style={{ animation: `fadeUp 0.5s ease ${idx * 0.08}s both` }}
              >
                {/* 专栏封面渐变头部 */}
                <div
                  className="column-cover"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                  <div className="column-cover-pattern" />
                  <span className="column-cover-icon">
                    {['📝', '✍️', '🎯', '🛠️', '🧠', '💼', '📖', '💰', '📊', '🌟'][idx % 10]}
                  </span>
                </div>

                {/* 专栏信息 */}
                <div className="column-body">
                  <h3 className="column-name">{col.name}</h3>
                  <p className="column-summary">{col.summary}</p>

                  {/* 文章列表 */}
                  {col.articles && col.articles.length > 0 && (
                    <div className="column-articles">
                      <span className="column-articles-label">
                        收录 {col.articles.length} 篇文章
                      </span>
                      <ul className="column-articles-list">
                        {col.articles.slice(0, 5).map((a, i) => (
                          <li key={i} className="column-article-item">
                            {a.slug ? (
                              <Link href={`/blog/${a.slug}`} className="column-article-link">
                                <span className="column-article-dot" />
                                <span className="column-article-title">{a.title}</span>
                              </Link>
                            ) : (
                              <span className="column-article-link column-article-link--plain">
                                <span className="column-article-dot" />
                                <span className="column-article-title">{a.title}</span>
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 底部元信息 */}
                  <div className="column-footer">
                    <span className="column-date">
                      {new Date(col.date).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="column-badge">专栏</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 底部 CTA */}
      <div className="subscribe-cta" style={{ marginBottom: 48 }}>
        <h3>📬 订阅专栏更新</h3>
        <p>当有新专栏或专栏更新时，第一时间通知你。</p>
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
