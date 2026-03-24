# AI Voice Assistance System (MVP)

外呼助手系统 MVP，面向销售外呼场景，支持客户导入、分配、跟进记录与管理统计。

## 项目目标

帮助团队快速搭建可用的外呼流程闭环：

- 管理员导入与分配客户
- 销售按分配名单执行外呼跟进
- 系统沉淀客户状态与通话日志
- 管理员实时查看团队数据

## 核心功能

- 账号登录与角色控制（`admin` / `sales`）
- Excel 客户导入（按 `phone` 去重）
- 客户自动均分与手动分配
- 销售工作台：客户状态、备注、微信、意向等级更新
- 每次客户更新自动写入 `call_logs`
- 管理端统计看板

## 技术栈

- Next.js 14（App Router）
- React 18 + TypeScript
- Tailwind CSS
- Supabase（Auth + Postgres + RLS）
- xlsx（Excel 解析）

## 目录结构

```text
outbound-assistant-mvp/
├─ src/
│  ├─ app/                  # 页面与 API 路由
│  ├─ components/           # 业务组件与通用 UI
│  ├─ lib/                  # 业务逻辑、常量、Supabase 客户端
│  └─ types/                # 类型定义
├─ supabase/
│  ├─ schema.sql            # 表结构
│  ├─ rls.sql               # 行级权限策略
│  └─ seed.sql              # 初始数据
└─ README.md
```

## 本地开发

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量

在项目根目录创建 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名KEY
NEXT_PUBLIC_XIAOKE_DIAL_URL_TEMPLATE=https://你的销氪地址/call?phone={phone}
```

### 3) 初始化数据库

在 Supabase SQL Editor 按顺序执行：

1. `supabase/schema.sql`
2. `supabase/rls.sql`
3. `supabase/seed.sql`

### 4) 启动开发服务

```bash
npm run dev
```

默认访问：`http://localhost:3000`

## 常用脚本

```bash
npm run dev    # 本地开发
npm run build  # 生产构建
npm run start  # 生产启动
npm run lint   # 代码检查
```

## 发布仓库

GitHub 仓库地址：<https://github.com/haotianwu436-maker/AI_Voice_Assitance_system>

## 说明

- 当前为 MVP 版本，优先保证流程可用。
- 若用于生产环境，建议补充：审计日志、错误监控、操作回滚、细粒度权限与自动化测试。
