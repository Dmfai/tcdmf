import { NextResponse } from 'next/server';
import { getBlogBySlug, updateBlog, deleteBlog } from '@/lib/blogStore';
import { verifyAdminToken } from '@/lib/auth';

// 获取单篇博客（公开）
export async function GET(_req, { params }) {
  try {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 更新博客（需鉴权）
export async function PUT(req, { params }) {
  try {
    const guard = verifyAdminToken(req);
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }
    const body = await req.json();
    const blog = await updateBlog(params.slug, body);
    if (!blog) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json({ error: err.message || '服务器错误' }, { status: 500 });
  }
}

// 删除博客（需鉴权）
export async function DELETE(req, { params }) {
  try {
    const guard = verifyAdminToken(req);
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }
    const ok = await deleteBlog(params.slug);
    if (!ok) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
