/**
 * 管理端 API 客户端：自动携带 Bearer token
 * 与 lib/api.js 的公开接口分离，避免污染访客侧
 */
import { getToken, clearToken } from '@/lib/adminToken';

const BASE = '/api';

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // 401 → 清理本地 token，调用方可据 res.status 跳登录
  if (res.status === 401) {
    clearToken();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const e = new Error(err.error || `请求失败：${res.status}`);
    e.status = res.status;
    throw e;
  }
  // 处理可能无 body 的响应（如 DELETE）
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/* ===== 鉴权 ===== */
export const adminLogin = (username, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

/* ===== 博客 CRUD ===== */
export const adminListBlogs = () => request('/blogs');

export const adminGetBlog = (slug) => request(`/blogs/${slug}`);

export const adminCreateBlog = (data) =>
  request('/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const adminUpdateBlog = (slug, data) =>
  request(`/blogs/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const adminDeleteBlog = (slug) =>
  request(`/blogs/${slug}`, { method: 'DELETE' });
