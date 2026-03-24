import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const [{ data: salesUsers, error: salesErr }, { data: customers, error: customerErr }] =
      await Promise.all([
        supabase.from("profiles").select("id,name").eq("role", "sales"),
        supabase
          .from("customers")
          .select("assigned_to,status,wechat_added,interested")
          .not("assigned_to", "is", null)
      ]);
    if (salesErr || customerErr) {
      return NextResponse.json({ error: salesErr?.message || customerErr?.message }, { status: 400 });
    }

    const byUser = new Map<string, { name: string; total: number; uncalled: number; connected: number; wechat: number; interested: number }>();
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
      const s = byUser.get(c.assigned_to);
      if (!s) return;
      s.total += 1;
      if (c.status === "未拨打") s.uncalled += 1;
      if (c.status === "已接通") s.connected += 1;
      if (c.wechat_added) s.wechat += 1;
      if (c.interested) s.interested += 1;
    });

    return NextResponse.json({ data: [...byUser.values()] });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "统计失败" },
      { status: 500 }
    );
  }
}
