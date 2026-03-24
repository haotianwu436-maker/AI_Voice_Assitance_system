# 外呼助手系统（MVP）

## 运行

1. 安装依赖

```bash
npm install
```

2. 创建 `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名KEY
NEXT_PUBLIC_XIAOKE_DIAL_URL_TEMPLATE=https://你的销氪地址/call?phone={phone}
```

3. 在 Supabase SQL Editor 顺序执行：

- `supabase/schema.sql`
- `supabase/rls.sql`
- `supabase/seed.sql`

4. 启动

```bash
npm run dev
```

## MVP 功能

- 登录与角色（admin/sales）
- Excel 客户导入（phone 去重）
- 客户均分与手动分配
- 销售客户工作台（状态/备注/微信/意向）
- 每次更新写入 call_logs
- 管理统计看板
