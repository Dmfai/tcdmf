'use client';

import { useState } from 'react';

/**
 * 文章分享与互动组件
 */
export default function ArticleActions({ title, slug }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/blog/${slug}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title} — ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = `${title} — ${url}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform) => {
    const text = encodeURIComponent(`${title} ${url}`);
    const urls = {
      weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
    };
    if (platform === 'wechat') {
      handleCopy();
      return;
    }
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="share-section">
      <span className="share-label">分享到：</span>
      <button className="share-btn share-btn--wechat" onClick={() => handleShare('wechat')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.5 11a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 2C6.48 2 2 6.06 2 11.05c0 2.78 1.47 5.27 3.77 6.87L5 22l4.5-2.5c.82.2 1.66.3 2.5.3 5.52 0 10-4.06 10-9.05S17.52 2 12 2z"/>
        </svg>
        微信
      </button>
      <button className="share-btn share-btn--weibo" onClick={() => handleShare('weibo')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.17 13.88c-2.08-.48-4.47.8-5.35 2.86-.87 2.06.1 4.13 2.18 4.62 2.08.48 4.47-.8 5.35-2.86.87-2.06-.1-4.13-2.18-4.62zm-2.46 3.87c-.26.61-.9.94-1.43.73-.53-.2-.75-.84-.5-1.45.26-.6.9-.94 1.44-.72.53.2.75.84.49 1.44zM20.07 9.2c-3.7-3.06-8.72-2.78-11.2.62-2.48 3.4-1.47 8.65 2.24 11.7 3.7 3.06 8.72 2.78 11.2-.62 2.48-3.4 1.48-8.65-2.24-11.7zm-2.12 8.86c-1.44 1.98-4.2 2.54-6.15 1.24-1.95-1.3-2.37-4.04-.93-6.02 1.44-1.98 4.2-2.54 6.15-1.24 1.95 1.3 2.37 4.04.93 6.02z"/>
        </svg>
        微博
      </button>
      <button className="share-btn share-btn--twitter" onClick={() => handleShare('twitter')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </button>
      <button className="share-btn share-btn--copy" onClick={handleCopy}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="5" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 4v9.5A1.5 1.5 0 003.5 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {copied ? '已复制 ✓' : '复制链接'}
      </button>
    </div>
  );
}
