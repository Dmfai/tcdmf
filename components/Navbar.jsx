'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  // 后台不显示访客导航
  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="navbar">
      <Link href="/" className="navbar-logo">
        <img src="/logo.png" alt="文辉工作室" className="nav-logo-img" />
        <span className="nav-logo-text">文辉工作室</span>
      </Link>
      <nav className="navbar-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="navbar-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
