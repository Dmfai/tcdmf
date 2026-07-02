import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';
import { verifyAdminToken } from '@/lib/auth';

// 获取作品列表（公开）
export async function GET() {
  try {
    await connectDB();
    const list = await Portfolio.find().sort({ date: -1 }).lean();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

// 新建作品（需鉴权）
export async function POST(req) {
  try {
    const guard = verifyAdminToken(req);
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }
    await connectDB();
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: 'title 必填' }, { status: 400 });
    }

    if (!body.slug) {
      body.slug = String(body.title)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '');
    }

    const item = await Portfolio.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
