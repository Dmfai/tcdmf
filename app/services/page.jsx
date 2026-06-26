import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '服务介绍',
  description: '我们提供的设计与开发服务。',
  path: '/services',
});

const services = [
  {
    title: 'UI/UX 设计',
    desc: '用户研究、信息架构、原型设计、视觉设计、可用性测试。',
    items: ['Figma 协作设计', '交互原型', '设计系统'],
  },
  {
    title: '响应式网站开发',
    desc: '基于 Next.js / React 的现代网站，全端适配，SEO 友好。',
    items: ['前端开发', '后端 API', '性能优化'],
  },
  {
    title: '技术解决方案',
    desc: '面向业务的架构咨询、系统集成、CI/CD 与运维支持。',
    items: ['架构评审', '系统集成', '部署运维'],
  },
];

export default function ServicesPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>服务介绍</h1>
        <p>从设计到开发到上线，全流程交付。</p>
      </header>

      <div className="grid-3" style={{ paddingBottom: 48 }}>
        {services.map((s) => (
          <article key={s.title} className="card">
            <div className="card-body">
              <h3 className="card-title">{s.title}</h3>
              <p className="card-desc">{s.desc}</p>
              <ul style={{ paddingLeft: 18, color: '#555', fontSize: 14 }}>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <section style={{ textAlign: 'center', padding: '48px 0 80px' }}>
        <h2>开始你的项目</h2>
        <p>告诉我们你的需求，24 小时内回复。</p>
        <Link href="/contact" className="btn">立即咨询</Link>
      </section>
    </div>
  );
}
