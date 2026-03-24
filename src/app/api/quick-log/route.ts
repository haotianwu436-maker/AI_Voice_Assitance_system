import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { COMMON_CALL_LOG_TEMPLATES } from "@/lib/constants/call-log-templates";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

    const body = (await request.json()) as { customerId?: string; templateKey?: string };
    const customerId = body.customerId || "";
    const templateKey = body.templateKey || "";
    if (!customerId || !templateKey) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }

    const template = COMMON_CALL_LOG_TEMPLATES.find((t) => t.key === templateKey);
    if (!template) return NextResponse.json({ error: "模板不存在" }, { status: 400 });

    const { error: updateError } = await supabase
      .from("customers")
      .update({
        status: template.status,
        note: template.remark,
        wechat_added: template.wechatAdded,
        interested: template.interested
      })
      .eq("id", customerId);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

    const { error: logError } = await supabase.from("call_logs").insert({
      customer_id: customerId,
      user_id: user.id,
      status: template.status,
      remark: template.remark
    });
    if (logError) return NextResponse.json({ error: logError.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "快捷记录失败" },
      { status: 500 }
    );
  }
}

