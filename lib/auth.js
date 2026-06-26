/**
 * 管理端鉴权工具
 *
 * 鉴权模型：
 * - 环境变量 ADMIN_TOKEN 是一个长随机串
 * - 登录接口（/api/auth/login）验证用户名密码后下发 ADMIN_TOKEN
 * - 客户端调用管理 API 时携带 `Authorization: Bearer <token>`
 * - middleware.js 在 Edge 层拦截写操作 API，校验 token
 * - 本文件提供 route handler 内部二次校验的能力（防御深度）
 */

/**
 * 从 Request 中校验管理员 token
 * @param {Request} req
 * @returns {{ ok: true } | { ok: false, status: number, error: string }}
 */
export function verifyAdminToken(req) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return { ok: false, status: 500, error: '服务端未配置 ADMIN_TOKEN' };
  }
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  // 常量时间比较，避免计时攻击
  if (!token || token.length !== expected.length) {
    return { ok: false, status: 401, error: '未授权' };
  }
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0 ? { ok: true } : { ok: false, status: 401, error: '未授权' };
}

/**
 * 在 route handler 内部使用的鉴权守卫
 * 用法：
 *   const guard = requireAdmin(req);
 *   if (!guard.ok) return guard.response();
 * @param {Request} req
 */
export function requireAdmin(req) {
  const r = verifyAdminToken(req);
  if (r.ok) return { ok: true };
  return {
    ok: false,
    response: () =>
      new Response(JSON.stringify({ error: r.error }), {
        status: r.status,
        headers: { 'Content-Type': 'application/json' },
      }),
  };
}
