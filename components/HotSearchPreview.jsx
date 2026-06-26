'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PLATFORM_CONFIG = {
  weibo: { label: '微博', icon: '🔥', color: '#e94560' },
  zhihu: { label: '知乎', icon: '💡', color: '#3b82f6' },
  baidu: { label: '百度', icon: '📈', color: '#ef4444' },
  toutiao: { label: '头条', icon: '⚡', color: '#f59e0b' },
};

const RANK_COLORS = ['#e94560', '#f59e0b', '#3b82f6'];

export default function HotSearchPreview() {
  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState('weibo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch('/api/hotsearch/all');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json.platforms || {});
        }
      } catch (err) {
        console.warn('[HotSearchPreview] fetch failed:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    // 每 5 分钟自动刷新
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const items = (data[activeTab] || []).slice(0, 8);

  return (
    <section className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 className="section-title">🔥 全网热搜</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, maxWidth: 520, margin: '8px auto 0' }}>
          实时聚合微博、知乎、百度、头条四大平台热榜，了解当下最热话题
        </p>
      </div>

      {/* 平台 Tab */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '8px 20px',
              borderRadius: 50,
              border: activeTab === key ? '2px solid transparent' : '1px solid var(--color-border)',
              background: activeTab === key ? cfg.color : 'var(--color-card)',
              color: activeTab === key ? '#fff' : 'var(--color-text-light)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            {cfg.icon} {cfg.label}
          </button>
        ))}
      </div>

      {/* 热榜列表 */}
      <div style={{
        maxWidth: 700, margin: '0 auto',
        background: 'var(--color-card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '24px 20px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < 7 ? '1px solid var(--color-border)' : 'none',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  flexShrink: 0,
                }} />
                <div style={{
                  flex: 1, height: 14, borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  animation: 'shimmer 1.5s infinite',
                  backgroundSize: '200% 100%',
                  backgroundImage: 'linear-gradient(90deg, var(--color-bg-alt) 0%, var(--color-border) 50%, var(--color-bg-alt) 100%)',
                }} />
                <div style={{
                  width: 40, height: 14, borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                }} />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
            暂无数据，请稍后刷新
          </div>
        ) : (
          <div style={{ padding: '12px 0' }}>
            {items.map((item, idx) => (
              <a
                key={item.keyword || idx}
                href={item.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-alt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* 排名 */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  background: idx < 3 ? RANK_COLORS[idx] : 'var(--color-bg-alt)',
                  color: idx < 3 ? '#fff' : 'var(--color-text-muted)',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {idx + 1}
                </span>

                {/* 关键词 */}
                <span style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: idx < 3 ? 600 : 400,
                  color: idx < 3 ? 'var(--color-primary)' : 'var(--color-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.keyword}
                </span>

                {/* 热度 */}
                {item.hot && (
                  <span style={{
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    flexShrink: 0,
                    minWidth: 48,
                    textAlign: 'right',
                  }}>
                    {typeof item.hot === 'number'
                      ? item.hot >= 10000
                        ? (item.hot / 10000).toFixed(1) + '万'
                        : item.hot
                      : item.hot}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* 查看全部 */}
      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <Link href="/hotsearch" className="btn btn-outline">
          🔥 查看完整热搜榜 →
        </Link>
      </div>
    </section>
  );
}
