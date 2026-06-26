/**
 * SEO 工具：在页面或 layout 中导出 metadata 对象时使用
 */
import { SITE_URL } from '@/config/env';

/**
 * 生成标准 metadata 对象（用于 Next.js generateMetadata）
 * @param {object} opts
 * @param {string} [opts.title]
 * @param {string} [opts.description]
 * @param {string[]} [opts.keywords]
 * @param {string} [opts.path] 站内路径，用于拼 og:url
 */
export function buildMetadata({ title, description, keywords, path = '' } = {}) {
  const fullTitle = title ? `${title} - 文辉工作室` : '文辉工作室 — 一人公司从0到1的写作与成长记录';
  const desc = description || '从0到1创业日志、写作方法、个人品牌实战，文辉工作室的真实记录。';
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description: desc,
    keywords: keywords || ['创业', '写作', '一人公司', '个人品牌', '内容创作', '文辉工作室'],
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: '文辉工作室',
      type: 'website',
    },
  };
}
