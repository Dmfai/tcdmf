import Card from '@/components/Card';
import { buildMetadata } from '@/lib/seo';
import { getPortfolios } from '@/lib/api';

export const metadata = buildMetadata({
  title: '作品案例',
  description: '我们近期完成的设计与开发作品。',
  path: '/portfolio',
});

// 服务端渲染时拉取数据
async function loadPortfolios() {
  try {
    return await getPortfolios();
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const portfolios = await loadPortfolios();

  return (
    <div className="container">
      <header className="page-header">
        <h1>作品案例</h1>
        <p>这里展示我们近期完成的部分项目。</p>
      </header>

      {portfolios.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '48px 0' }}>
          作品即将上线，敬请期待。
        </p>
      ) : (
        <div className="grid-3" style={{ paddingBottom: 80 }}>
          {portfolios.map((p) => (
            <Card
              key={p.slug}
              title={p.title}
              description={p.description}
              cover={p.cover}
              tags={p.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
