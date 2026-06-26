'use client';

import { useState, useEffect, useCallback } from 'react';

const TABS = [
  { key: 'weibo', label: '微博热搜', icon: '🔥', color: '#e6162d' },
  { key: 'zhihu', label: '知乎热榜', icon: '💡', color: '#0066ff' },
  { key: 'baidu', label: '百度热搜', icon: '🔍', color: '#4e6ef2' },
  { key: 'toutiao', label: '头条热榜', icon: '📰', color: '#e4393c' },
];

function formatHot(value) {
  if (!value) return '';
  const n = parseInt(value, 10);
  if (isNaN(n)) return String(value).length > 8 ? String(value).slice(0, 8) + '…' : value;
  if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿';
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  return n.toLocaleString();
}

function HotItem({ item, rank }) {
  const badges = [];
  if (item.isHot) badges.push('热');
  if (item.isNew) badges.push('新');
  if (item.isBoil) badges.push('爆');
  if (item.tag) badges.push(item.tag);

  return (
    <a
      href={item.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="hs-item"
      style={{ animationDelay: `${rank * 40}ms` }}
    >
      <span className={`hs-rank ${rank <= 3 ? 'hs-rank--top' : ''}`}>
        {item.rank || rank}
      </span>
      <span className="hs-keyword">
        {item.keyword || item.title || item.query || '—'}
        {badges.map((b, i) => (
          <span key={i} className={`hs-tag hs-tag--${b === '爆' ? 'boil' : b === '热' ? 'hot' : b === '新' ? 'new' : ''}`}>
            {b}
          </span>
        ))}
      </span>
      <span className="hs-right">
        {item.hotValue || item.hot ? (
          <span className="hs-hot">{formatHot(item.hotValue || item.hot)}</span>
        ) : null}
      </span>
    </a>
  );
}

function Skeleton() {
  return (
    <div className="hs-skeleton">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="hs-skel-item" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="hs-skel-rank" />
          <div className="hs-skel-text" />
          <div className="hs-skel-hot" />
        </div>
      ))}
    </div>
  );
}

export default function HotSearchPage() {
  const [activeTab, setActiveTab] = useState('weibo');
  const [data, setData] = useState({}); // { weibo: [...], zhihu: [...], ... }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/hotsearch/all');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json.platforms || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const currentList = data[activeTab] || [];

  return (
    <>
      {/* Hero 区 */}
      <section className="hs-hero">
        <div className="hs-hero-glow" />
        <h1 className="hs-hero-title">
          <span className="hs-hero-icon">🔍</span>
          全网热搜
          <span className="hs-hero-badge">实时</span>
        </h1>
        <p className="hs-hero-sub">
          聚合微博、知乎、百度、头条四大平台热榜，了解当下最热话题
        </p>
        <div className="hs-hero-meta">
          <span>📡 数据来源：coderutil 聚合 API</span>
          <span>🕐 每 5 分钟自动刷新</span>
          <button onClick={fetchAll} className="hs-refresh-btn" disabled={loading}>
            {loading ? '⏳ 刷新中...' : '🔄 手动刷新'}
          </button>
        </div>
      </section>

      {/* Tab 切换栏 */}
      <section className="hs-container">
        <div className="hs-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`hs-tab ${activeTab === tab.key ? 'hs-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              style={{
                '--tab-color': tab.color,
                borderBottomColor: activeTab === tab.key ? tab.color : 'transparent',
              }}
            >
              <span className="hs-tab-icon">{tab.icon}</span>
              {tab.label}
              {data[tab.key]?.length > 0 && (
                <span className="hs-tab-count">{data[tab.key].length}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 热搜列表 */}
      <section className="hs-container">
        <div className="hs-list-wrap">
          {loading ? (
            <Skeleton />
          ) : error ? (
            <div className="hs-error">
              <span className="hs-error-icon">⚠️</span>
              <p>数据加载失败：{error}</p>
              <button onClick={fetchAll} className="btn">重新加载</button>
            </div>
          ) : currentList.length === 0 ? (
            <div className="hs-empty">
              <span className="hs-empty-icon">📭</span>
              <p>暂未获取到热搜数据，请稍后刷新</p>
            </div>
          ) : (
            <div className="hs-list">
              {/* 前三名高亮卡片 */}
              {currentList.slice(0, 3).length > 0 && (
                <div className="hs-top3">
                  {currentList.slice(0, 3).map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hs-top3-card hs-top3-card--${idx}`}
                    >
                      <div className="hs-top3-medal">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="hs-top3-title">
                        {item.keyword || item.title || item.query || '—'}
                      </div>
                      {item.hotValue || item.hot ? (
                        <div className="hs-top3-hot">{formatHot(item.hotValue || item.hot)}</div>
                      ) : null}
                      <div className="hs-top3-badges">
                        {item.isBoil && <span className="hs-top3-tag hs-top3-tag--boil">爆</span>}
                        {item.isHot && <span className="hs-top3-tag hs-top3-tag--hot">热</span>}
                        {item.isNew && <span className="hs-top3-tag hs-top3-tag--new">新</span>}
                        {item.tag && <span className="hs-top3-tag">{item.tag}</span>}
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* 完整列表 */}
              <div className="hs-list-title">
                <span>📋 全部热搜</span>
                <span className="hs-list-updated">
                  更新于 {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {currentList.map((item, idx) => (
                <HotItem key={idx} item={item} rank={idx + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 底部说明 */}
      <section className="hs-container" style={{ paddingBottom: 80 }}>
        <div className="divider divider-accent" style={{ marginBottom: 32 }} />
        <div className="hs-footer-note">
          <h3>📌 关于热搜栏目</h3>
          <p>
            本栏目聚合自第三方热搜 API，每 5 分钟自动刷新一次。
            数据来源于微博、知乎、百度、今日头条的公开热榜接口。
            点击任意条目可跳转至原始链接查看详情。
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
            注：热搜内容由各平台自动生成，不代表本站立场。
          </p>
        </div>
      </section>
    </>
  );
}
