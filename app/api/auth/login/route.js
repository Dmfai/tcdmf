import { NextResponse } from 'next/server';

/**
 * 管理员登录
 * POST /api/auth/login
 * body: { username, password }
 * 返回: { token } —— 客户端需在后续管理 API 调用中携带 Authorization: Bearer <token>
 */
export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    const token = process.env.ADMIN_TOKEN;

    if (!expectedUser || !expectedPass || !token) {
      return NextResponse.json(
        { error: '服务端未配置管理员账号' },
        { status: 500 }
      );
    }

    // 常量时间比较，避免计时攻击
    const safeEqual = (a, b) => {
      const sa = String(a);
      const sb = String(b);
      if (sa.length !== sb.length) return false;
      let diff = 0;
      for (let i = 0; i < sa.length; i++) {
        diff |= sa.charCodeAt(i) ^ sb.charCodeAt(i);
      }
      return diff === 0;
    };

    if (safeEqual(username, expectedUser) && safeEqual(password, expectedPass)) {
      return NextResponse.json({ token });
    }

    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || '服务器错误' },
      { status: 500 }
    );
  }
}
