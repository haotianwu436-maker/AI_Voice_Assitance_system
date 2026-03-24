import { StatsCards } from "@/components/admin/stats-cards";
import { createClient } from "@/lib/supabase/server";

export default async function AdminStatsPage() {
  const supabase = createClient();
  const [{ data: salesUsers }, { data: customers }] = await Promise.all([
    supabase.from("profiles").select("id,name").eq("role", "sales"),
    supabase.from("customers").select("assigned_to,status,wechat_added,interested").not("assigned_to", "is", null)
  ]);

  const byUser = new Map<
    string,
    { name: string; total: number; uncalled: number; connected: number; wechat: number; interested: number }
  >();

  (salesUsers || []).forEach((u) =>
    byUser.set(u.id, {
      name: u.name || "未命名销售",
      total: 0,
      uncalled: 0,
      connected: 0,
      wechat: 0,
      interested: 0
    })
  );

  (customers || []).forEach((c) => {
    if (!c.assigned_to) return;
    const row = byUser.get(c.assigned_to);
    if (!row) return;
    row.total += 1;
    if (c.status === "未拨打") row.uncalled += 1;
    if (c.status === "已接通") row.connected += 1;
    if (c.wechat_added) row.wechat += 1;
    if (c.interested) row.interested += 1;
  });

  return (
    <StatsCards items={[...byUser.values()]} />
  );
}
