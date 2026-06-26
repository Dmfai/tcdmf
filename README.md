# 工作室官网

基于 **Next.js 14 App Router + API Routes + MongoDB** 的工作室官网脚手架。

## 技术栈

- Next.js 14（App Router）
- React 18
- MongoDB + Mongoose 8
- markdown-it + highlight.js（博客 Markdown 渲染）
- Tailwind CSS 3（与原生 CSS 共存）
- 内置 SEO（动态 sitemap / robots）
- 内置管理端鉴权中间件
- 内置管理后台 UI（登录 + 博客 CRUD）

## 目录结构

```
website/
├── app/                          # App Router
│   ├── (site 页面)/
│   ├── admin/                    # 管理后台
│   │   ├── (dashboard)/          # 受保护区域（带侧栏外壳）
│   │   │   ├── blogs/            # 博客列表 / 新建 / 编辑
│   │   │   └── page.jsx          # 仪表盘
│   │   └── login/                # 登录页
│   ├── api/                      # API Routes
│   ├── sitemap.js / robots.js    # SEO
├── components/
│   ├── admin/                    # 后台专用组件
│   └── *.jsx                     # 前台通用组件
├── lib/                          # 工具库（DB / API / SEO / 鉴权）
├── models/                       # Mongoose 模型
├── config/                       # 配置
└── styles/                       # 样式（含 admin.css）
```

## 快速开始

```bash
cd F:/dwhai/website
cp .env.local.example .env.local   # 填入你的 MONGO_URI
npm install
npm run dev                        # http://localhost:3000
```

## API 一览

| 方法 | 路径 | 鉴权 | 说明 |
|:---|:---|:---|:---|
| GET | `/api/blogs` | 公开 | 获取所有博客 |
| POST | `/api/blogs` | 需 token | 新建博客 |
| GET | `/api/blogs/:slug` | 公开 | 获取单篇博客 |
| PUT | `/api/blogs/:slug` | 需 token | 更新博客 |
| DELETE | `/api/blogs/:slug` | 需 token | 删除博客 |
| GET | `/api/portfolio` | 公开 | 获取作品列表 |
| POST | `/api/portfolio` | 需 token | 新建作品 |
| POST | `/api/contact` | 公开 | 提交联系表单 |
| GET | `/api/contact` | 需 token | 获取联系记录 |
| POST | `/api/auth/login` | 公开 | 管理员登录，返回 token |

## 鉴权使用

1. 在 `.env.local` 配置 `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_TOKEN`
2. 客户端调用 `POST /api/auth/login` 提交用户名密码，拿到 `token`
3. 后续管理 API 调用携带 `Authorization: Bearer <token>`
4. `middleware.js` 在 Edge 层拦截写操作；route handler 内 `verifyAdminToken` 作为二次校验

## 管理后台

访问 `/admin` 进入管理后台：

- `/admin/login` — 登录页（用户名 + 密码）
- `/admin` — 仪表盘（概览 + 最近文章）
- `/admin/blogs` — 博客列表（查看 / 编辑 / 删除）
- `/admin/blogs/new` — 新建文章
- `/admin/blogs/:slug/edit` — 编辑文章

鉴权流程：
- 登录成功后 token 存入 `localStorage`（key: `admin_token`）
- 客户端 `AdminGuard` 守卫所有 `/admin/*` 页面，未登录跳 `/admin/login`
- `lib/adminApi.js` 自动给所有请求带 `Authorization: Bearer <token>`
- 服务端 `middleware.js` + route handler 二次校验，token 失效时客户端自动清理并跳登录

## 部署

推荐部署到 [Vercel](https://vercel.com)：
1. 仓库推到 GitHub
2. Vercel 关联仓库，自动识别 Next.js
3. 在 Vercel 项目设置中配置环境变量 `MONGO_URI` 与 `SITE_URL`
4. 点击 Deploy
