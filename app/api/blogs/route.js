import { NextResponse } from 'next/server';
import { getAllBlogs, createBlog } from '@/lib/blogStore';
import { verifyAdminToken } from '@/lib/auth';

// 获取所有博客（公开）
export async function GET() {
  try {
    const blogs = await getAllBlogs();
    return NextResponse.json(blogs);
  } catch (err) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 新建博客（需鉴权）
export async function POST(req) {
  try {
    const guard = verifyAdminToken(req);
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'title 与 content 必填' }, { status: 400 });
    }

    const blog = await createBlog(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || '服务器错误' }, { status: 500 });
  }
}
