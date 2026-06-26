/**
 * 博客数据层 —— JSON 文件存储（无需 MongoDB）
 *
 * 数据文件：data/blogs.json
 * 读写通过 Node.js fs 模块，支持并发安全（写锁）
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'blogs.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readBlogs() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeBlogs(blogs) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
}

// 简单写锁，防止并发写入冲突
let writeLock = false;
const lockQueue = [];

async function acquireLock() {
  if (!writeLock) {
    writeLock = true;
    return;
  }
  return new Promise((resolve) => {
    lockQueue.push(resolve);
  });
}

function releaseLock() {
  if (lockQueue.length > 0) {
    const next = lockQueue.shift();
    next();
  } else {
    writeLock = false;
  }
}

// ==================== 公开 API ====================

/** 获取所有博客，按日期倒序 */
export async function getAllBlogs() {
  const blogs = readBlogs();
  return blogs
    .map((b) => ({ ...b }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** 根据 slug 获取单篇博客 */
export async function getBlogBySlug(slug) {
  const blogs = readBlogs();
  const blog = blogs.find((b) => b.slug === slug);
  return blog ? { ...blog } : null;
}

/** 创建博客 */
export async function createBlog(data) {
  await acquireLock();
  try {
    const blogs = readBlogs();

    // 检查 slug 唯一性
    if (data.slug && blogs.some((b) => b.slug === data.slug)) {
      throw new Error('slug 已存在');
    }

    const blog = {
      _id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: data.title,
      slug: data.slug || generateSlug(data.title, blogs),
      content: data.content,
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    blogs.push(blog);
    writeBlogs(blogs);
    return { ...blog };
  } finally {
    releaseLock();
  }
}

/** 更新博客 */
export async function updateBlog(slug, data) {
  await acquireLock();
  try {
    const blogs = readBlogs();
    const idx = blogs.findIndex((b) => b.slug === slug);
    if (idx === -1) return null;

    const blog = blogs[idx];
    if (data.title !== undefined) blog.title = data.title;
    if (data.content !== undefined) blog.content = data.content;
    if (data.excerpt !== undefined) blog.excerpt = data.excerpt;
    if (data.tags !== undefined) blog.tags = data.tags;
    if (data.date !== undefined) blog.date = new Date(data.date).toISOString();
    if (data.slug !== undefined && data.slug !== slug) {
      // slug 变更需检查唯一性
      if (blogs.some((b) => b.slug === data.slug)) {
        throw new Error('slug 已存在');
      }
      blog.slug = data.slug;
    }
    blog.updatedAt = new Date().toISOString();

    blogs[idx] = blog;
    writeBlogs(blogs);
    return { ...blog };
  } finally {
    releaseLock();
  }
}

/** 删除博客 */
export async function deleteBlog(slug) {
  await acquireLock();
  try {
    const blogs = readBlogs();
    const idx = blogs.findIndex((b) => b.slug === slug);
    if (idx === -1) return false;

    blogs.splice(idx, 1);
    writeBlogs(blogs);
    return true;
  } finally {
    releaseLock();
  }
}

/** 生成唯一 slug */
function generateSlug(title, existing) {
  let slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) slug = 'untitled';

  // 确保唯一
  let base = slug;
  let i = 1;
  while (existing.some((b) => b.slug === slug)) {
    slug = `${base}-${i}`;
    i++;
  }
  return slug;
}
