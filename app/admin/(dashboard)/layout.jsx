'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { isLoggedIn, clearToken } from '@/lib/adminToken';
import AdminGuard from '@/components/admin/AdminGuard';

const navItems = [
  { href: '/admin', label: '仪表盘', exact: true },
  { href: '/admin/blogs', label: '博客管理' },
];

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">工作室后台</div>
      <nav className="admin-nav">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${active ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function Topbar() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onLogout = () => {
    setBusy(true);
    clearToken();
    router.replace('/admin/login');
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-right">
        <button
          type="button"
          className="admin-btn-ghost"
          onClick={onLogout}
          disabled={busy}
        >
          {busy ? '退出中…' : '退出登录'}
        </button>
      </div>
    </header>
  );
}

/**
 * 后台外壳：侧栏 + 顶栏 + 内容区
 * 客户端守卫：未登录自动跳 /admin/login
 */
export default function DashboardLayout({ children }) {
  return (
    <AdminGuard requireAuth>
      <div className="admin-shell">
        <Sidebar />
        <div className="admin-main">
          <Topbar />
          <section className="admin-content">{children}</section>
        </div>
      </div>
    </AdminGuard>
  );
}
