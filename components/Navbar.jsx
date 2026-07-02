'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我们' },
  { href: '/blog', label: '博客' },
  { href: '/columns', label: '📚 专栏' },
  { href: '/hotsearch', label: '🔥 热搜' },
  { href: '/github', label: '🤖 GitHub AI周榜' },
  { href: '/portfolio', label: '作品' },
  { href: '/services', label: '服务' },
  { href: '/contact', label: '联系' },
  { href: '/admin/login', label: '后台' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // 路由变化时关闭菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // 点击外部关闭菜单
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.navbar-nav') && !e.target.closest('.nav-toggle')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpen]);

  // 设备宽度变化时关闭菜单
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 后台不显示访客导航
  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="navbar">
      <Link href="/" className="navbar-logo">
        <img src="/logo.png" alt="文辉工作室" className="nav-logo-img" />
        <span className="nav-logo-text">文辉工作室</span>
      </Link>

      {/* 汉堡菜单按钮 (小屏显示) */}
      <button
        className={`nav-toggle ${menuOpen ? 'nav-open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar-nav ${menuOpen ? 'nav-open' : ''}`}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="navbar-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
