/**
 * 专栏数据层 —— JSON 文件存储
 *
 * 数据文件：data/columns.json
 * 参照 mogu_blog_v2 的 Subject 模型设计
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'columns.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readColumns() {
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

function writeColumns(columns) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(columns, null, 2), 'utf-8');
}

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

/** 获取所有专栏，按 sort 降序排列（sort 越大越靠前） */
export async function getAllColumns() {
  const columns = readColumns();
  return columns
    .map((c) => ({ ...c }))
    .sort((a, b) => (b.sort || 0) - (a.sort || 0));
}

/** 根据 ID 获取单个专栏 */
export async function getColumnById(id) {
  const columns = readColumns();
  const column = columns.find((c) => c._id === id);
  return column ? { ...column } : null;
}

/** 创建专栏 */
export async function createColumn(data) {
  await acquireLock();
  try {
    const columns = readColumns();
    const column = {
      _id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: data.name,
      summary: data.summary || '',
      cover: data.cover || '',
      sort: data.sort || 0,
      articleCount: (data.articles || []).length,
      articles: data.articles || [],
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    columns.push(column);
    writeColumns(columns);
    return { ...column };
  } finally {
    releaseLock();
  }
}

/** 删除专栏 */
export async function deleteColumn(id) {
  await acquireLock();
  try {
    const columns = readColumns();
    const idx = columns.findIndex((c) => c._id === id);
    if (idx === -1) return false;
    columns.splice(idx, 1);
    writeColumns(columns);
    return true;
  } finally {
    releaseLock();
  }
}
