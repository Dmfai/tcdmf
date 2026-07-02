'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ScrollParallax from '@/components/ScrollParallax';
import Card from '@/components/Card';
import AIWeeklyPicks from '@/components/AIWeeklyPicks';
import HotSearchPreview from '@/components/HotSearchPreview';

const highlights = [
  {
    title: '🚀 创业日志',
    description: '记录一人工作室从定位、选题到最小可行产品的完整落地过程，每一步都是真实实验与复盘。',
    tags: ['创业', '复盘', '实操'],
    icon: '🚀',
  },
  {
    title: '✍️ 写作与表达方法',
    description: '分享写作流程、题库管理与标签化复用策略，帮你高效产出每日内容。',
    tags: ['写作', '工作流', '效率'],
    icon: '✍️',
  },
];

const stats = [
  { value: 12, suffix: '+', label: '原创文章', icon: '📄' },
  { value: 10, suffix: '', label: '专栏合集', icon: '📚' },
  { value: 6, suffix: '', label: '内容栏目', icon: '📂' },
  { value: 24, suffix: '/7', label: '持续更新', icon: '🔄' },
  { value: 1000, suffix: '+', label: '累计读者', icon: '👥' },
];

const coverGradients = [
  'linear-gradient(135deg, #e94560, #ff6b6b)',
  'linear-gradient(135deg, #7c3aed, #a78bfa)',
  'linear-gradient(135deg, #0ea5a9, #5eead4)',
];

/* ===== 滚动进入动画 Hook ===== */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ===== 数字滚动动画组件 ===== */
function AnimatedStat({ value, suffix, label, icon, delay = 0 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal(0.3);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      const duration = 1200;
      const steps = 40;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, value, delay]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }} className="animate-on-scroll">
      <div style={{ fontSize: 22, marginBottom: 4, transition: 'transform 0.3s ease' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {icon}
      </div>
      <div className="stat-number" style={{
        fontSize: '1.4rem', fontWeight: 800,
        color: 'var(--color-primary)', lineHeight: 1.2,
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

/* ===== 浮动粒子背景 ===== */
function FloatingParticles({ count = 12, colors = ['#e94560','#7c3aed','#0ea5a9','#f0a500','#3b82f6'] }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const size = Math.random() * 6 + 3;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 6 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    return { id: i, size, left, delay, duration, color };
  });

  return (
    <div className="floating-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ===== 主内容组件 ===== */
export default function HomeContent({ columns }) {
  // 全局滚动入场监听
  useEffect(() => {
    const els = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="hero">
        {/* 装饰粒子 */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.6, animation: 'fadeUp 3s ease-in-out infinite alternate', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '20%', right: '20%', width: 5, height: 5, borderRadius: '50%', background: 'var(--color-purple)', opacity: 0.5, animation: 'fadeUp 2.5s ease-in-out 0.5s infinite alternate', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '25%', left: '25%', width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal)', opacity: 0.5, animation: 'fadeUp 3.5s ease-in-out 0.8s infinite alternate', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '35%', right: '10%', width: 4, height: 4, borderRadius: '50%', background: 'var(--color-gold)', opacity: 0.6, animation: 'fadeUp 2.8s ease-in-out 1.2s infinite alternate', zIndex: 0 }} />

        <ScrollParallax text="一人公司从0到1的写作与成长记录" />
        <p className="hero-subtitle">文辉工作室 · 用持续输出的内容，见证从无名到有声的创业过程</p>
        <div className="hero-actions">
          <Link href="/blog" className="btn">📖 阅读博客</Link>
          <Link href="/about" className="btn btn-outline">了解更多</Link>
        </div>
      </section>

      {/* ===== 数据统计条 (带彩色渐变背景) ===== */}
      <section className="stats-band" style={{ position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles count={8} />
        <div style={{
          maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 10,
          padding: '36px 24px 44px',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 12, background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-lg)', padding: '28px 20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.8)',
          }} className="animate-on-scroll">
            {stats.map((s, idx) => (
              <AnimatedStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} icon={s.icon} delay={idx * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 为什么选择文辉工作室 ===== */}
      <section className="value-section" style={{ position: 'relative' }}>
        <FloatingParticles count={15} colors={['#e94560','#7c3aed','#0ea5a9','#f0a500']} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title animate-on-scroll">为什么选择文辉工作室</h2>
          <div className="value-grid">
            {[
              { icon: '📝', title: '真实记录', desc: '每一步都是真实实验与复盘，不回避困难，不掩饰进展。', color: 'var(--color-accent)' },
              { icon: '🧩', title: '系统方法', desc: '从内容选题到变现流程都有完整框架，可复制可落地。', color: 'var(--color-purple)' },
              { icon: '🛠️', title: '工具落地', desc: '分享可立即复用的模板与工具，让效率翻倍。', color: 'var(--color-teal)' },
              { icon: '🌱', title: '独立成长', desc: '鼓励个人持续输出与能力积累，一个人也能做成内容事业。', color: 'var(--color-gold)' },
            ].map((v, idx) => (
              <div key={v.title} className="value-item animate-on-scroll" style={{ borderTop: `3px solid ${v.color}` }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GitHub AI 周榜精选 ===== */}
      <AIWeeklyPicks />

      {/* ===== 适合人群 ===== */}
      <section className="audience-section" style={{ position: 'relative' }}>
        <FloatingParticles count={10} colors={['#f0a500','#e94560','#f59e0b']} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title animate-on-scroll">你适合这里吗？</h2>
          <div className="audience-list animate-on-scroll delay-2">
            <p>如果你想把内容创作变成稳定的独立收入；</p>
            <p>如果你想从一个人的实践中找到可复制路径；</p>
            <p>{'如果你接受"每天进步一点点" —'}</p>
          </div>
          <p className="audience-cta animate-on-scroll delay-3">那么文辉工作室愿意成为你的同行者。</p>
        </div>
      </section>

      {/* ===== 全网热搜 ===== */}
      <HotSearchPreview />

      {/* ===== 专栏合集 ===== */}
      <div className="columns-section-wrapper" style={{ position: 'relative' }}>
        <FloatingParticles count={10} colors={['#0ea5a9','#7c3aed','#3b82f6']} />
        <section className="container" style={{ paddingTop: 64, paddingBottom: 16, position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-on-scroll">
            <h2 className="section-title" style={{ marginBottom: 8 }}>📚 专栏合集</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>
              10个主题专栏，按专题系统化阅读——从创业日志到写作方法，从品牌实战到效率工具
            </p>
          </div>

          <div className="columns-grid" style={{ paddingBottom: 16 }}>
            {columns.slice(0, 3).map((col, idx) => (
              <div
                key={col._id}
                className="column-card animate-on-scroll"
                style={{ animation: `fadeUp 0.5s ease ${idx * 0.06}s both` }}
              >
                <Link
                  href={`/columns?id=${col._id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div className="column-cover" style={{ background: coverGradients[idx % coverGradients.length] }}>
                    <div className="column-cover-pattern" />
                    <span className="column-cover-icon">{['🚀','✍️','🎯'][idx]}</span>
                  </div>
                </Link>
                <div className="column-body">
                  <Link href={`/columns?id=${col._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="column-name">{col.name}</h3>
                    <p className="column-summary">{col.summary}</p>
                  </Link>
                  <div className="column-articles">
                    <span className="column-articles-label">{col.articleCount} 篇文章</span>
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
                    </ul>
                  </div>
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

          <div style={{ textAlign: 'center', padding: '32px 0' }} className="animate-on-scroll">
            <Link href="/columns" className="btn btn-outline">
              📚 查看全部 10 个专栏 →
            </Link>
          </div>
        </section>
      </div>

      {/* ===== 更多内容 ===== */}
      <div className="services-section-wrapper" style={{ position: 'relative' }}>
        <FloatingParticles count={10} colors={['#3b82f6','#e94560','#f0a500']} />
        <section className="services container" style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>
          <h2 className="section-title animate-on-scroll">更多内容</h2>
          <div className="service-cards">
            {highlights.map((s, idx) => (
              <div key={s.title} className="animate-on-scroll" style={{ animation: `fadeUp 0.6s ease ${idx * 0.15}s both` }}>
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
      </div>

      {/* ===== CTA ===== */}
      <div className="cta-section-wrapper" style={{ position: 'relative' }}>
        <FloatingParticles count={18} colors={['#e94560','#7c3aed','#ffffff','#f0a500']} />
        <section className="container" style={{ textAlign: 'center', padding: '80px 0', position: 'relative', zIndex: 1 }}>
          <div className="divider divider-accent" style={{ marginBottom: 48, opacity: 0.4 }} />
          <h2 className="animate-on-scroll" style={{ fontSize: '1.8rem', marginBottom: 12, color: '#fff' }}>
            有想法？一起聊聊
          </h2>
          <p className="animate-on-scroll delay-1" style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>
            从内容定位到品牌变现，我们陪你走完每一步
          </p>
          <div className="animate-on-scroll delay-2">
            <Link href="/contact" className="btn" style={{ fontSize: '1.05rem', padding: '14px 36px', animation: 'pulseGlow 2.5s ease-in-out infinite' }}>
              ✉️ 联系我们
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
