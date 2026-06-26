/**
 * 管理端 token 的本地存取
 * - 仅在浏览器端使用（localStorage）
 * - 服务端渲染时这些 API 不可用，调用方需在 useEffect / 事件处理中调用
 */

const KEY = 'admin_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(KEY, token);
  } else {
    window.localStorage.removeItem(KEY);
  }
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return !!getToken();
}
