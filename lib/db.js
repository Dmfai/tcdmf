import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

// 开发环境下复用连接，避免热重载时反复连接
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * 连接 MongoDB，复用缓存连接
 * @returns {Promise<typeof mongoose | null>}
 */
export async function connectDB() {
  if (!MONGO_URI) {
    console.warn('MONGO_URI 未设置，跳过数据库连接');
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
