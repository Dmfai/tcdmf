import '@/styles/admin.css';

/**
 * /admin/* 的最外层布局
 * 仅做最小包装；带侧栏的后台外壳由 (dashboard)/layout.jsx 提供
 */
export const metadata = {
  title: '管理后台 - 我的工作室',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="admin-root">{children}</div>;
}
