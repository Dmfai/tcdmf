'use client';

import { useState, useEffect, useCallback } from 'react';

function RepoItem({ repo, rank }) {
  return (
    <a
      href={repo.url || `https://github.com/${repo.fullName}`}
      target="_blank"
      rel="noopener noreferrer"
      className="gh-item"
      style={{ animationDelay: `${rank * 40}ms` }}
    >
      {/* 排名 */}
      <span className={`gh-rank ${rank <= 3 ? 'gh-rank--top' : ''}`}>
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
      </span>

      {/* 主体 */}
      <div className="gh-body">
        {/* 仓库名 */}
        <div className="gh-repo-line">
          <span className="gh-repo-icon">📦</span>
          <span className="gh-repo-name">{repo.author}/</span>
          <span className="gh-repo-name gh-repo-name--bold">{repo.name || repo.fullName?.split('/')[1]}</span>
        </div>

        {/* 描述 */}
        {repo.description && (
          <p className="gh-desc">{repo.description}</p>
        )}

        {/* 元信息行 */}
        <div className="gh-meta">
          {/* 语言 */}
          {repo.language && (
            <span className="gh-lang">
              <span
                className="gh-lang-dot"
                style={{ background: repo.languageColor || '#858585' }}
              />
              {repo.language}
            </span>
          )}
          {/* Star */}
          <span className="gh-stat" title="Stars">
            ⭐ {repo.stars}
          </span>
          {/* Fork */}
          <span className="gh-stat" title="Forks">
            🍴 {repo.forks}
          </span>
          {/* 本周新增 */}
          {repo.currentPeriodStars && (
            <span className="gh-stat gh-stat--trend" title="本周新增 Star">
              📈 {repo.currentPeriodStars} stars this week
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

function Top3Card({ repo, idx }) {
  return (
    <a
      href={repo.url || `https://github.com/${repo.fullName}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`gh-top3-card gh-top3-card--${idx}`}
    >
      <div className="gh-top3-medal">
        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
      </div>
      <div className="gh-top3-repo">
        {repo.author}/<strong>{repo.name || repo.fullName?.split('/')[1]}</strong>
      </div>
      {repo.description && (
        <p className="gh-top3-desc">{repo.description}</p>
      )}
      <div className="gh-top3-stats">
        <span>⭐ {repo.stars}</span>
        {repo.currentPeriodStars && (
          <span>📈 {repo.currentPeriodStars} this week</span>
        )}
      </div>
    </a>
  );
}

function Skeleton() {
  return (
    <div className="gh-skeleton">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="gh-skel-item" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="gh-skel-rank" />
          <div className="gh-skel-body">
            <div className="gh-skel-line gh-skel-line--short" />
            <div className="gh-skel-line" />
          </div>
        </div>
      ))}
    </div>
  );
}

// AI 分类名称映射（用于展示 aiCategory 标签）
const CAT_LABELS = {
  'llm': 'LLM',
  'agent': 'Agent',
  'multimodal': '多模态',
  'rag': 'RAG',
  'ml-framework': 'ML框架',
  'ai-tools': 'AI工具',
  'other-ai': '其他AI',
};

function getCatLabel(catKey) {
  return CAT_LABELS[catKey] || '';
}

export default function GitHubPage() {
  const [activeCat, setActiveCat] = useState('all');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github?cat=${cat}&since=weekly`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeCat);
  }, [activeCat, fetchData]);

  const categories = data?.categories || [];
  const repos = data?.repos || [];
  const currentCatLabel = categories.find((c) => c.key === activeCat)?.label || '全部 AI';

  return (
    <>
      {/* Hero */}
      <section className="gh-hero">
        <div className="gh-hero-glow" />
        <h1 className="gh-hero-title">
          <span className="gh-hero-icon">🐙</span>
          GitHub AI 周榜
          <span className="gh-hero-badge">AI Trending</span>
        </h1>
        <p className="gh-hero-sub">
          每周 GitHub 热门 AI 开源项目排行，按领域分类浏览，紧跟 AI 技术前沿
        </p>
        <div className="gh-hero-meta">
          <span>📡 数据来源：GitHub Trending</span>
          <span>🕐 每 30 分钟自动刷新</span>
          <button onClick={() => fetchData(activeCat)} className="gh-refresh-btn" disabled={loading}>
            {loading ? '⏳ 刷新中...' : '🔄 手动刷新'}
          </button>
        </div>
      </section>

      {/* AI 分类 Tab 栏 */}
      <section className="gh-container">
        <div className="gh-tabs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`gh-tab ${activeCat === cat.key ? 'gh-tab--active' : ''}`}
              onClick={() => setActiveCat(cat.key)}
              style={{
                '--tab-color': cat.color || '#6366f1',
                borderBottomColor: activeCat === cat.key ? (cat.color || '#6366f1') : 'transparent',
              }}
            >
              <span className="gh-tab-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 排行榜 */}
      <section className="gh-container">
        <div className="gh-list-wrap">
          {loading ? (
            <Skeleton />
          ) : error ? (
            <div className="gh-error">
              <span className="gh-error-icon">⚠️</span>
              <p>数据加载失败：{error}</p>
              <button onClick={() => fetchData(activeCat)} className="btn">重新加载</button>
            </div>
          ) : repos.length === 0 ? (
            <div className="gh-empty">
              <span className="gh-empty-icon">📭</span>
              <p>暂无「{currentCatLabel}」分类的周榜数据，请稍后刷新或切换分类</p>
            </div>
          ) : (
            <div className="gh-list">
              {/* 前三名高亮卡片 */}
              {repos.slice(0, 3).length > 0 && (
                <div className="gh-top3">
                  {repos.slice(0, 3).map((repo, idx) => (
                    <Top3Card key={idx} repo={repo} idx={idx} />
                  ))}
                </div>
              )}

              {/* 完整列表 */}
              <div className="gh-list-title">
                <span>📋 {currentCatLabel} 周榜 Top {repos.length}</span>
                {data?.updatedAt && (
                  <span className="gh-list-updated">
                    更新于 {new Date(data.updatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              {repos.map((repo, idx) => (
                <RepoItem key={repo.fullName || idx} repo={repo} rank={idx + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 底部说明 */}
      <section className="gh-container" style={{ paddingBottom: 80 }}>
        <div className="divider divider-accent" style={{ marginBottom: 32 }} />
        <div className="gh-footer-note">
          <h3>📌 关于 GitHub AI 周榜</h3>
          <p>
            本栏目数据来源于 GitHub Trending，自动筛选 AI 领域热门开源项目，
            并按 LLM/大模型、AI Agent、多模态/视觉、RAG、ML 框架、AI 工具等方向智能分类。
            点击任意项目可跳转至 GitHub 仓库页面查看详情。
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
            数据每 30 分钟刷新一次，分类基于仓库名称、描述及标签关键词自动匹配。
          </p>
        </div>
      </section>
    </>
  );
}
