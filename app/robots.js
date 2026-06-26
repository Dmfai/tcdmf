import { SITE_URL } from '@/config/env';

/**
 * robots.txt：Next.js 自动挂载到 /robots.txt
 * - 允许全部页面爬取
 * - 屏蔽 /api 与 /admin
 * - 声明 sitemap 位置
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
