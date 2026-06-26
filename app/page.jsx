import Link from 'next/link';
import ScrollParallax from '@/components/ScrollParallax';
import Card from '@/components/Card';
import AIWeeklyPicks from '@/components/AIWeeklyPicks';
import HotSearchPreview from '@/components/HotSearchPreview';
import { buildMetadata } from '@/lib/seo';
import { getAllColumns } from '@/lib/columnStore';

export const metadata = buildMetadata({ path: '/' });

const highlights = [
  {
    title: '从0到1创业日志',
    description: '记录一人工作室从定位、选题到最小可行产品的完整落地过程，每一步都是真实实验与复盘。',
    tags: ['创业', '复盘', '实操'],
    icon: '🚀',
  },
  {
    title: '写作与表达方法',
    description: '分享写作流程、题库管理与标签化复用策略，帮你高效产出每日内容。',
    tags: ['写作', '工作流', '效率'],
    icon: '✍️',
  },
];

const stats = [
  { value: '12+', label: '原创文章', icon: '📄' },
  { value: '10', label: '专栏合集', icon: '📚' },
  { value: '6', label: '内容栏目', icon: '📂' },
  { value: '24/7', label: '持续更新', icon: '🔄' },
  { value: '1000+', label: '累计读者', icon: '👥' },
];

// 每个专栏的渐变色方案
const coverGradients = [
  'linear-gradient(135deg, #e94560, #ff6b6b)',
  'linear-gradient(135deg, #7c3aed, #a78bfa)',
  'linear-gradient(135deg, #0ea5a9, #5eead4)',
  'linear-gradient(135deg, #3b82f6, #93c5fd)',
  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  'linear-gradient(135deg, #ec4899, #f9a8d4)',
  'linear-gradient(135deg, #10b981, #6ee7b7)',
  'linear-gradient(135deg, #6366f1, #a5b4fc)',
  'linear-gradient(135deg, #f97316, #fdba74)',
  'linear-gradient(135deg, #14b8a6, #99f6e4)',
];

export default async function HomePage() {
  const columns = await getAllColumns();

  return (
    <>
      {/* Hero 区 */}
      <section className="hero">
        {/* 装饰粒子 */}
        <div style={{
          position: 'absolute', top: '10%', left: '15%',
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--color-accent)', opacity: 0.6,
          animation: 'fadeUp 3s ease-in-out infinite alternate',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '20%',
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--color-purple)', opacity: 0.5,
          animation: 'fadeUp 2.5s ease-in-out 0.5s infinite alternate',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', bottom: '25%', left: '25%',
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--color-teal)', opacity: 0.5,
          animation: 'fadeUp 3.5s ease-in-out 0.8s infinite alternate',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', top: '35%', right: '10%',
          width: 4, height: 4, borderRadius: '50%',
          background: 'var(--color-gold)', opacity: 0.6,
          animation: 'fadeUp 2.8s ease-in-out 1.2s infinite alternate',
          zIndex: 0,
        }} />

        <ScrollParallax text="一人公司从0到1的写作与成长记录" />
        <p className="hero-subtitle">文辉工作室 — 用持续输出的内容，见证从无名到有声的创业过程</p>
        <div className="hero-actions">
          <Link href="/blog" className="btn">📖 阅读博客</Link>
          <Link href="/about" className="btn btn-outline">了解更多</Link>
        </div>
      </section>

      {/* 数据统计条 */}
      <section style={{
        maxWidth: 900, margin: '-40px auto 0', position: 'relative', zIndex: 10,
        padding: '0 24px',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 12, background: 'var(--color-card)', borderRadius: 'var(--radius-lg)',
          padding: '24px 16px', boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.2 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 为什么选择文辉工作室（第一） ===== */}
      <section className="container value-section" style={{ paddingTop: 64 }}>
        <h2 className="section-title">为什么选择文辉工作室</h2>
        <div className="value-grid">
          <div className="value-item" style={{ borderTop: '3px solid var(--color-accent)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
            <h3>真实记录</h3>
            <p>每一步都是真实实验与复盘，不回避困难，不掩饰进展。</p>
          </div>
          <div className="value-item" style={{ borderTop: '3px solid var(--color-purple)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🧩</div>
            <h3>系统方法</h3>
            <p>从内容选题到变现流程都有完整框架，可复制可落地。</p>
          </div>
          <div className="value-item" style={{ borderTop: '3px solid var(--color-teal)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🛠️</div>
            <h3>工具落地</h3>
            <p>分享可立即复用的模板与工具，让效率翻倍。</p>
          </div>
          <div className="value-item" style={{ borderTop: '3px solid var(--color-gold)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌱</div>
            <h3>独立成长</h3>
            <p>鼓励个人持续输出与能力积累，一个人也能做成内容事业。</p>
          </div>
        </div>
      </section>

      {/* ===== GitHub AI 周榜精选 ===== */}
      <AIWeeklyPicks />

      {/* 适合人群 */}
      <section className="container audience-section">
        <h2 className="section-title">你适合这里吗？</h2>
        <div className="audience-list">
          <p>如果你想把内容创作变成稳定的独立收入；</p>
          <p>如果你想从一个人的实践中找到可复制路径；</p>
          <p>如果你接受&ldquo;每天进步一点点&rdquo;——</p>
        </div>
        <p className="audience-cta">那么文辉工作室愿意成为你的同行者。</p>
      </section>

      {/* ===== 全网热搜（自动更新） ===== */}
      <HotSearchPreview />

      {/* ===== 专栏合集正区（第二，只展示3条） ===== */}
      <section className="container" style={{ paddingTop: 64, paddingBottom: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 className="section-title" style={{ marginBottom: 8 }}>📚 专栏合集</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>
            10个主题专栏，按专题系统化阅读——从创业日志到写作方法，从品牌实战到效率工具
          </p>
        </div>

        <div className="columns-grid" style={{ paddingBottom: 16 }}>
          {columns.slice(0, 3).map((col, idx) => (
            <div
              key={col._id}
              className="column-card"
              style={{ animation: `fadeUp 0.5s ease ${idx * 0.06}s both` }}
            >
              <Link
                href={`/columns?id=${col._id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                {/* 封面渐变头部 */}
                <div className="column-cover" style={{ background: coverGradients[idx % coverGradients.length] }}>
                  <div className="column-cover-pattern" />
                  <span className="column-cover-icon">
                    {['🚀','✍️','🎯'][idx]}
                  </span>
                </div>
              </Link>
              {/* 内容区 */}
              <div className="column-body">
                <Link
                  href={`/columns?id=${col._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h3 className="column-name">{col.name}</h3>
                  <p className="column-summary">{col.summary}</p>
                </Link>
                {/* 文章列表 */}
                <div className="column-articles">
                  <span className="column-articles-label">
                    {col.articleCount} 篇文章
                  </span>
                  <ul className="column-articles-list">
                    {col.articles.slice(0, 3).map((a) => (
                      <li key={a.title} className="column-article-item">
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
                    {col.articles.length > 3 && (
                      <li style={{ fontSize: 12, color: 'var(--color-text-muted)', paddingLeft: 13 }}>
                        +{col.articles.length - 3} 篇更多...
                      </li>
                    )}
                  </ul>
                </div>
                {/* 底部 */}
                <div className="column-footer">
                  <span className="column-date">
                    {new Date(col.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })}
                  </span>
                  <span className="column-badge">专栏</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 查看全部入口 */}
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <Link href="/columns" className="btn btn-outline">
            📚 查看全部 10 个专栏 →
          </Link>
        </div>
      </section>

      {/* ===== 更多内容（第三） ===== */}
      <section className="services container" style={{ paddingTop: 0 }}>
        <h2 className="section-title">更多内容</h2>
        <div className="service-cards">
          {highlights.map((s, idx) => (
            <div key={s.title} style={{ animation: `fadeUp 0.6s ease ${idx * 0.15}s both` }}>
              <Card
                href={s.href || '/blog'}
                title={<>{s.icon} {s.title}</>}
                description={s.description}
                tags={s.tags}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ===== 有想法？一起聊聊（最后） ===== */}
      <section className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div className="divider divider-accent" style={{ marginBottom: 48 }} />
        <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>有想法？一起聊聊</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: 28 }}>从内容定位到品牌变现，我们陪你走完每一步。</p>
        <Link href="/contact" className="btn" style={{ fontSize: '1.05rem', padding: '14px 36px' }}>
          ✉️ 联系我们
        </Link>
      </section>
    </>
  );
}
