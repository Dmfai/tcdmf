'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 与 Navbar 保持一致的导航项（不含管理后台）
const footerNavItems = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我们' },
  { href: '/blog', label: '博客' },
  { href: '/columns', label: '📚 专栏' },
  { href: '/hotsearch', label: '🔥 热搜' },
  { href: '/github', label: '🤖 GitHub AI周榜' },
  { href: '/portfolio', label: '作品' },
  { href: '/services', label: '服务' },
  { href: '/contact', label: '联系' },
];

export default function Footer() {
  const pathname = usePathname();
  // 后台不显示访客页脚
  if (pathname?.startsWith('/admin')) return null;

  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link">
            <img src="/logo.png" alt="文辉工作室" className="footer-logo" />
            文辉工作室
          </Link>
          <p>用文字照亮独立创作的每一步</p>
          <div className="footer-social">
            <a href="https://wx.qq.com" target="_blank" rel="noopener noreferrer" aria-label="微信" title="微信" className="social-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
              </svg>
            </a>
            <a href="https://www.douyin.com" target="_blank" rel="noopener noreferrer" aria-label="抖音" title="抖音" className="social-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.59 15.952a5.13 5.13 0 0 1-5.08-5.13H8.35v-2.07h2.66V9.843a5.116 5.116 0 0 0 4.789 3.235c2.644 0 4.789-2.07 4.789-4.582 0-1.398-.674-2.746-1.787-3.83H12V2h-2.07v14.184c0 2.14 1.764 3.922 3.982 3.922s3.982-1.782 3.982-3.922c0-.163-.013-.323-.038-.48z"/>
              </svg>
            </a>
            <a href="https://www.feishu.cn" target="_blank" rel="noopener noreferrer" aria-label="飞书" title="飞书" className="social-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 2L2 22h4l1.5-5H12l1.5 5h4L19 2h-4l-1.5 6H10L8.5 2H6zm5 9l-1.5-5h-1L7 11h4z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-links">
          {footerNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="footer-copy">
        © {year} 文辉工作室 保留所有权利
      </div>
    </footer>
  );
}
