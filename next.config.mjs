/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // 避免 watchpack 扫描到盘根（F:\System Volume Information）
  // 把监视限定在工作区内
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
