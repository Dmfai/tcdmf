/**
 * 环境变量集中读取，避免散落各处
 */
export const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
export const MONGO_URI = process.env.MONGO_URI;
