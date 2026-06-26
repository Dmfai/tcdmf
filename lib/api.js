/**
 * 前端调用的 API 封装：统一从同源 /api 拉取数据
 */

const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `请求失败：${res.status}`);
  }
  return res.json();
}

/** 获取所有博客 */
export const getBlogs = () => request(`${BASE}/blogs`);

/** 获取单篇博客 */
export const getBlogBySlug = (slug) => request(`${BASE}/blogs/${slug}`);

/** 获取作品列表 */
export const getPortfolios = () => request(`${BASE}/portfolio`);

/** 提交联系表单 */
export const submitContact = (data) =>
  request(`${BASE}/contact`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
