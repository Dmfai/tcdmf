/**
 * 说说（微动态）数据层 —— JSON 文件存储
 *
 * 数据文件：data/moments.json
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'moments.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readMoments() {
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

function writeMoments(moments) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(moments, null, 2), 'utf-8');
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

/** 获取所有说说，按日期倒序 */
export async function getAllMoments() {
  const moments = readMoments();
  return moments
    .map((m) => ({ ...m }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** 获取最近 N 条说说 */
export async function getRecentMoments(limit = 5) {
  const moments = await getAllMoments();
  return moments.slice(0, limit);
}

/** 创建说说 */
export async function createMoment(data) {
  await acquireLock();
  try {
    const moments = readMoments();
    const moment = {
      _id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      content: data.content,
      source: data.source || '',
      tags: data.tags || [],
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    moments.push(moment);
    writeMoments(moments);
    return { ...moment };
  } finally {
    releaseLock();
  }
}

/** 删除说说 */
export async function deleteMoment(id) {
  await acquireLock();
  try {
    const moments = readMoments();
    const idx = moments.findIndex((m) => m._id === id);
    if (idx === -1) return false;
    moments.splice(idx, 1);
    writeMoments(moments);
    return true;
  } finally {
    releaseLock();
  }
}
