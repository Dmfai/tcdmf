/**
 * 热搜 API — 代理 coderutil 热搜聚合接口
 * GET /api/hotsearch?type=weibo|zhihu|baidu|toutiao
 */
import { NextResponse } from 'next/server';

const API_BASE = 'https://www.coderutil.com/api/resou/v1';
const ACCESS_KEY = 'f94be500c45148bc185be24a38c04ad3';
const SECRET_KEY = '27563ca627d5db0d57e831ca4de0f75f';

// 内存缓存：同一 type 5 分钟内不重复请求
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'weibo';

  const cacheKey = `hs_${type}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const url = `${API_BASE}/${type}?access-key=${ACCESS_KEY}&secret-key=${SECRET_KEY}`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Upstream responded ${res.status}`);
    }

    const json = await res.json();

    const data = {
      type,
      updatedAt: new Date().toISOString(),
      items: (json.data || json.list || []).slice(0, 30),
    };

    cache.set(cacheKey, { data, time: Date.now() });

    return NextResponse.json(data);
  } catch (err) {
    console.error(`[hotsearch] fetch ${type} failed:`, err.message);
    return NextResponse.json(
      { type, items: [], error: err.message },
      { status: 502 },
    );
  }
}
