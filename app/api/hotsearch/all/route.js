/**
 * 聚合热搜 API — 一次拉取所有平台的热搜
 * GET /api/hotsearch/all
 */
import { NextResponse } from 'next/server';

const API_BASE = 'https://www.coderutil.com/api/resou/v1';
const ACCESS_KEY = process.env.CODERUTIL_ACCESS_KEY;
const SECRET_KEY = process.env.CODERUTIL_SECRET_KEY;

if (!ACCESS_KEY || !SECRET_KEY) {
  console.warn('[hotsearch/all] CODERUTIL_ACCESS_KEY / CODERUTIL_SECRET_KEY 未配置，API 不可用');
}

const PLATFORMS = ['weibo', 'zhihu', 'baidu', 'toutiao'];

// 全量缓存 5 分钟
let allCache = null;
let allCacheTime = 0;
const ALL_CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  if (!ACCESS_KEY || !SECRET_KEY) {
    return NextResponse.json({ updatedAt: new Date().toISOString(), platforms: {} });
  }

  if (allCache && Date.now() - allCacheTime < ALL_CACHE_TTL) {
    return NextResponse.json(allCache);
  }

  const results = {};

  await Promise.all(
    PLATFORMS.map(async (type) => {
      try {
        const url = `${API_BASE}/${type}?access-key=${ACCESS_KEY}&secret-key=${SECRET_KEY}`;
        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        results[type] = (json.data || json.list || []).slice(0, 30);
      } catch (err) {
        console.error(`[hotsearch/all] ${type} failed:`, err.message);
        results[type] = [];
      }
    }),
  );

  const data = {
    updatedAt: new Date().toISOString(),
    platforms: results,
  };

  allCache = data;
  allCacheTime = Date.now();

  return NextResponse.json(data);
}
