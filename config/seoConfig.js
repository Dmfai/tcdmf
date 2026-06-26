/**
 * 全站 SEO 默认配置
 */
export const seoConfig = {
  siteName: '文辉工作室',
  defaultTitle: '文辉工作室 - 一人公司从0到1的写作与成长记录',
  defaultDescription: '文辉工作室，记录一人创业、内容创作与个人品牌成长的真实实践。从定位、选题到变现，用持续输出的内容见证从无名到有声的过程。',
  defaultKeywords: ['一人创业', '内容创作', '个人品牌', '写作', '独立创作者', '文辉工作室'],
  author: '文辉工作室',
  twitterHandle: '@wenhui',
};

/**
 * 生成结构化 JSON-LD（用于组织 / 网站身份）
 */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: seoConfig.siteName,
  url: process.env.SITE_URL || 'http://localhost:3000',
};
