import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Contact from '@/models/Contact';
import { verifyAdminToken } from '@/lib/auth';

// 提交联系表单（公开 —— 访客可提交）
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'name、email、message 均必填' },
        { status: 400 }
      );
    }

    // 简单邮箱校验
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 });
    }

    const item = await Contact.create(body);
    return NextResponse.json({ ok: true, id: item._id }, { status: 201 });
  } catch (err) {
    console.error('[contact] error:', err);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

// 获取所有联系记录（需鉴权 —— 仅管理端）
export async function GET(req) {
  try {
    const guard = verifyAdminToken(req);
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }
    await connectDB();
    const list = await Contact.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
