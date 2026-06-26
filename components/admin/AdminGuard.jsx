'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@/lib/adminToken';

/**
 * 客户端路由守卫
 * - 未登录访问受保护后台页 → 跳 /admin/login
 * - 已登录访问 /admin/login → 跳 /admin
 * - 校验仅在客户端做，服务端 API 仍会二次鉴权（防御深度）
 */
export default function AdminGuard({ children, requireAuth = true }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    const onLogin = pathname === '/admin/login';

    if (requireAuth && !loggedIn && !onLogin) {
      router.replace('/admin/login');
      return;
    }
    if (!requireAuth && loggedIn && onLogin) {
      router.replace('/admin');
      return;
    }
    setReady(true);
  }, [router, pathname, requireAuth]);

  if (!ready) {
    return (
      <div className="admin-loading">加载中…</div>
    );
  }
  return children;
}
