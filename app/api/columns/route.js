import { NextResponse } from 'next/server';
import { getAllColumns, getColumnById } from '@/lib/columnStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const column = await getColumnById(id);
      if (!column) {
        return NextResponse.json({ success: false, error: '专栏不存在' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: column });
    }

    const columns = await getAllColumns();
    return NextResponse.json({ success: true, data: columns });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
