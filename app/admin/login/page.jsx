'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminLogin } from '@/lib/adminApi';
import { setToken, isLoggedIn } from '@/lib/adminToken';
import AdminGuard from '@/components/admin/AdminGuard';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  // 已登录则跳后台
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/admin');
    }
  }, [router]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', msg: '登录中…' });
    try {
      const { token } = await adminLogin(form.username, form.password);
      setToken(token);
      setStatus({ state: 'success', msg: '登录成功，正在跳转…' });
      router.replace('/admin');
    } catch (err) {
      setStatus({ state: 'error', msg: err.message || '登录失败' });
    }
  };

  return (
    <AdminGuard requireAuth={false}>
      <div className="admin-login-wrap">
        <form className="admin-login-card" onSubmit={onSubmit}>
          <h1 className="admin-login-title">管理后台</h1>
          <p className="admin-login-sub">登录后管理博客与作品</p>

          <div className="admin-field">
            <label className="admin-label" htmlFor="username">用户名</label>
            <input
              id="username"
              name="username"
              className="admin-input"
              value={form.username}
              onChange={onChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="password">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              className="admin-input"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="admin-btn-primary"
            disabled={status.state === 'loading'}
          >
            {status.state === 'loading' ? '登录中…' : '登录'}
          </button>

          {status.msg && (
            <p
              className="admin-login-msg"
              style={{ color: status.state === 'error' ? '#c00' : '#070' }}
            >
              {status.msg}
            </p>
          )}

          <Link href="/" className="admin-login-back">← 返回首页</Link>
        </form>
      </div>
    </AdminGuard>
  );
}
