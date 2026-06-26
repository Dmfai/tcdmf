import { NextResponse } from 'next/server';

/**
 * 全局中间件：管理端 API 鉴权
 *
 * 规则：
 * - /api/blogs      GET  公开
 * - /api/blogs/*    GET  公开
 * - /api/blogs/*    PUT/DELETE  需鉴权
 * - /api/blogs      POST 需鉴权
 * - /api/portfolio  GET  公开
 * - /api/portfolio  POST 需鉴权
 * - /api/contact    POST 公开（访客提交表单）
 * - /api/contact    GET  需鉴权
 * - /api/auth/*     全部放行（登录接口）
 */
const PUBLIC_RULES = [
  { path: '/api/blogs', method: 'GET', exact: true },
  { path: '/api/blogs/', method: 'GET', exact: false }, // /api/blogs/:slug GET
  { path: '/api/portfolio', method: 'GET', exact: true },
  { path: '/api/contact', method: 'POST', exact: true },
  { path: '/api/auth/', method: '*', exact: false },
];

function isPublic(pathname, method) {
  const m = method.toUpperCase();
  return PUBLIC_RULES.some((rule) => {
    if (rule.method !== '*' && rule.method !== m) return false;
    return rule.exact
      ? pathname === rule.path
      : pathname.startsWith(rule.path);
  });
}

function tokenOk(req) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7).trim();
  if (!token || token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  // 公开规则放行
  if (isPublic(pathname, method)) {
    return NextResponse.next();
  }

  // 其余管理操作校验 token
  if (tokenOk(req)) {
    return NextResponse.next();
  }
  return NextResponse.json({ error: '未授权' }, { status: 401 });
}

export const config = {
  // 仅拦截 API 路由，避免影响页面渲染
  matcher: [
    '/api/blogs/:path*',
    '/api/portfolio/:path*',
    '/api/contact/:path*',
  ],
};
