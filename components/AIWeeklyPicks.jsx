'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORY_LABELS } from '@/lib/githubData';

const CATEGORY_COLORS = {
  llm: { bg: 'rgba(139,92,246,0.12)', text: '#7c3aed' },
  agent: { bg: 'rgba(6,182,212,0.12)', text: '#0891b2' },
  multimodal: { bg: 'rgba(236,72,153,0.12)', text: '#db2777' },
  rag: { bg: 'rgba(245,158,11,0.12)', text: '#d97706' },
  'ml-framework': { bg: 'rgba(16,185,129,0.12)', text: '#059669' },
  'ai-tools': { bg: 'rgba(239,68,68,0.12)', text: '#dc2626' },
  'other-ai': { bg: 'rgba(99,102,241,0.12)', text: '#6366f1' },
};

const BORDER_COLORS = [
  'var(--color-accent)',
  'var(--color-purple)',
  'var(--color-teal)',
  'var(--color-gold)',
  'var(--color-blue)',
  'var(--color-emerald)',
];

export default function AIWeeklyPicks() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch('/api/github?cat=all&since=weekly');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setRepos((json.repos || []).slice(0, 6));
        }
      } catch (err) {
        console.warn('[AIWeeklyPicks] fetch failed:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  // 加载骨架屏
  if (loading) {
    return (
      <section className="container" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 className="section-title">🤖 GitHub AI 周榜精选</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, maxWidth: 520, margin: '8px auto 0' }}>
            每周追踪 GitHub 上最热门的 AI 开源项目，帮你把握技术风向
          </p>
        </div>
        <div className="value-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="value-item" style={{ textAlign: 'left', height: '100%', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${BORDER_COLORS[i % 6]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--color-bg-alt)' }} />
                <div style={{ height: 16, width: '60%', borderRadius: 4, background: 'var(--color-bg-alt)', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-bg-alt) 0%, var(--color-border) 50%, var(--color-bg-alt) 100%)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 13, width: '100%', borderRadius: 3, background: 'var(--color-bg-alt)', marginBottom: 6, animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-bg-alt) 0%, var(--color-border) 50%, var(--color-bg-alt) 100%)' }} />
                <div style={{ height: 13, width: '70%', borderRadius: 3, background: 'var(--color-bg-alt)', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-bg-alt) 0%, var(--color-border) 50%, var(--color-bg-alt) 100%)' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <div style={{ width: 48, height: 20, borderRadius: 50, background: 'var(--color-bg-alt)' }} />
                <div style={{ width: 56, height: 20, borderRadius: 50, background: 'var(--color-bg-alt)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (repos.length === 0) return null;

  return (
    <section className="container" style={{ paddingTop: 64, paddingBottom: 48 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 className="section-title">🤖 GitHub AI 周榜精选</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, maxWidth: 520, margin: '8px auto 0' }}>
          每周追踪 GitHub 上最热门的 AI 开源项目，帮你把握技术风向
        </p>
      </div>

      <div
        className="value-grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}
      >
        {repos.map((repo, idx) => (
          <a
            key={repo.fullName}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              animation: `fadeUp 0.5s ease ${idx * 0.08}s both`,
            }}
          >
            <div
              className="value-item"
              style={{
                textAlign: 'left',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `3px solid ${BORDER_COLORS[idx % 6]}`,
              }}
            >
              {/* 排名 & 仓库名 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background:
                      idx === 0
                        ? 'linear-gradient(135deg, #f59e0b, #e94560)'
                        : idx === 1
                          ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                          : idx === 2
                            ? 'linear-gradient(135deg, #cd7f32, #b45309)'
                            : 'var(--color-bg-alt)',
                    color: idx < 3 ? '#fff' : 'var(--color-text-muted)',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </span>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {repo.fullName}
                </h3>
              </div>

              {/* 描述 */}
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--color-text-light)',
                  lineHeight: 1.7,
                  margin: '0 0 12px',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {repo.description}
              </p>

              {/* 底部标签 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 50,
                    fontSize: 11,
                    fontWeight: 600,
                    background: (CATEGORY_COLORS[repo.aiCategory] || CATEGORY_COLORS['other-ai']).bg,
                    color: (CATEGORY_COLORS[repo.aiCategory] || CATEGORY_COLORS['other-ai']).text,
                  }}
                >
                  {CATEGORY_LABELS[repo.aiCategory] || repo.aiCategory}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  ⭐ {repo.stars}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  🍴 {repo.forks}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* 查看完整榜单 */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link href="/github" className="btn btn-outline">
          📊 查看完整 GitHub AI 周榜 →
        </Link>
      </div>
    </section>
  );
}
