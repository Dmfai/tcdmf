import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '关于我们',
  description: '文辉工作室，一人公司从0到1的写作与成长记录。',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>我们的故事</h1>
        <p>一个人，一支笔，一段从0到1的旅程。</p>
      </header>

      <article style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 80 }}>
        <p style={{ fontSize: 18, lineHeight: 1.8 }}>
          文辉工作室诞生于一个人的选择：用一份持续输出的内容，见证从「无名到有声」的创业过程。
          这里不会回避困难，也不会掩饰进展，所有方法与经验都来自真实实践。
        </p>

        <h2>使命</h2>
        <p>
          为独立创作者提供一套可落地的「从0到1」系统，帮助你在写作与个人品牌道路上少走弯路。
        </p>

        <h2>愿景</h2>
        <p>
          成为一人创业者的真实参考与能力进阶平台，让更多人相信：一个人也能把内容事业做成。
        </p>

        <h2>核心价值</h2>
        <ul style={{ fontSize: 16, lineHeight: 2 }}>
          <li><strong>真实记录</strong> — 每一步都是真实实验与复盘</li>
          <li><strong>系统方法</strong> — 从内容选题到变现流程都有完整框架</li>
          <li><strong>工具落地</strong> — 分享可立即复用的模板与工具</li>
          <li><strong>独立成长</strong> — 鼓励个人持续输出与能力积累</li>
        </ul>
      </article>
    </div>
  );
}
