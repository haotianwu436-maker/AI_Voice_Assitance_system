import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CUSTOMER_STATUS_OPTIONS } from "@/lib/constants/customer-status";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

    const formData = await request.formData();
    const customerId = String(formData.get("customer_id") || "");
    const status = String(formData.get("status") || "");
    const note = String(formData.get("note") || "");
    const wechatAdded = formData.get("wechat_added") === "on";
    const interested = formData.get("interested") === "on";

    if (!customerId) return NextResponse.json({ error: "缺少customer_id" }, { status: 400 });
    if (!CUSTOMER_STATUS_OPTIONS.includes(status as never)) {
      return NextResponse.json({ error: "状态不合法" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("customers")
      .update({
        status: status as (typeof CUSTOMER_STATUS_OPTIONS)[number],
        note: note || null,
        wechat_added: wechatAdded,
        interested
      })
      .eq("id", customerId);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

    const { error: logError } = await supabase.from("call_logs").insert({
      customer_id: customerId,
      user_id: user.id,
      status: status as (typeof CUSTOMER_STATUS_OPTIONS)[number],
      remark: note || null
    });
    if (logError) return NextResponse.json({ error: logError.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "更新失败" },
      { status: 500 }
    );
  }
}
