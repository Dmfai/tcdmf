import { buildMetadata } from '@/lib/seo';
import { getAllColumns } from '@/lib/columnStore';
import HomeContent from '@/components/HomeContent';

export const metadata = buildMetadata({ path: '/' });

export default async function HomePage() {
  const columns = await getAllColumns();
  return <HomeContent columns={columns} />;
}
