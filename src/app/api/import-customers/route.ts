import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCustomerExcel } from "@/lib/excel/parse-customers";

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

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请上传 Excel 文件" }, { status: 400 });
    }

    const { customers, invalidRows } = parseCustomerExcel(await file.arrayBuffer());
    if (customers.length === 0) {
      return NextResponse.json({ error: "文件中没有有效客户数据", invalidRows }, { status: 400 });
    }

    const payload = customers.map((c) => ({
      phone: c.phone,
      name: c.name,
      note: c.note,
      status: "未拨打" as const,
      assigned_to: null,
      wechat_added: false,
      interested: false
    }));

    const { error } = await supabase
      .from("customers")
      .upsert(payload, { onConflict: "phone_normalized", ignoreDuplicates: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      success: true,
      totalRows: customers.length,
      invalidRows,
      insertedOrSkipped: customers.length
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "导入失败" },
      { status: 500 }
    );
  }
}
