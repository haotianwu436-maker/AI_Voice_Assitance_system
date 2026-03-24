import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
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

    const body = (await request.json()) as
      | { mode: "auto" }
      | { mode: "manual"; customerId: string; assignedTo: string | null };

    if (body.mode === "manual") {
      const { error } = await supabase
        .from("customers")
        .update({ assigned_to: body.assignedTo })
        .eq("id", body.customerId);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ success: true });
    }

    const [{ data: salesUsers, error: salesErr }, { data: customers, error: customerErr }] =
      await Promise.all([
        supabase.from("profiles").select("id").eq("role", "sales"),
        supabase.from("customers").select("id").is("assigned_to", null).order("created_at", { ascending: true })
      ]);
    if (salesErr || customerErr) {
      return NextResponse.json({ error: salesErr?.message || customerErr?.message }, { status: 400 });
    }
    if (!salesUsers?.length) return NextResponse.json({ error: "暂无销售账号" }, { status: 400 });

    const updates = (customers || []).map((c, i) => ({
      id: c.id,
      assigned_to: salesUsers[i % salesUsers.length].id
    }));

    for (const item of updates) {
      const { error } = await supabase
        .from("customers")
        .update({ assigned_to: item.assigned_to })
        .eq("id", item.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, updated: updates.length });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "分配失败" },
      { status: 500 }
    );
  }
}
