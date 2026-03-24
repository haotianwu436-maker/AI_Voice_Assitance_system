"use client";

import { useState } from "react";
import { CUSTOMER_STATUS_OPTIONS } from "@/lib/constants/customer-status";
import { COMMON_CALL_LOG_TEMPLATES } from "@/lib/constants/call-log-templates";

export function CustomerUpdateForm({
  customerId,
  phone,
  defaultStatus,
  defaultNote,
  defaultWechatAdded,
  defaultInterested
}: {
  customerId: string;
  phone: string;
  defaultStatus: string;
  defaultNote: string | null;
  defaultWechatAdded: boolean;
  defaultInterested: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-customer", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "更新失败");
      setMessage("保存成功");
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "更新失败");
    } finally {
      setLoading(false);
    }
  }

  async function quickLog(templateKey: string) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/quick-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, templateKey })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "快捷记录失败");
      setMessage("记录成功");
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "快捷记录失败");
    } finally {
      setLoading(false);
    }
  }

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(phone);
      setMessage("号码已复制");
    } catch {
      setMessage("复制失败，请手动复制");
    }
  }

  function dialBySystem() {
    window.location.href = `tel:${phone}`;
  }

  function openXiaoke() {
    const template = process.env.NEXT_PUBLIC_XIAOKE_DIAL_URL_TEMPLATE || "";
    if (!template) {
      setMessage("未配置销氪链接模板，请联系管理员");
      return;
    }
    const targetUrl = template.includes("{phone}")
      ? template.replace("{phone}", encodeURIComponent(phone))
      : template;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-2 rounded border p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button onClick={copyPhone} type="button" className="rounded border px-3 py-2 text-xs hover:bg-slate-50">
          复制号码
        </button>
        <button onClick={dialBySystem} type="button" className="rounded border px-3 py-2 text-xs hover:bg-slate-50">
          系统拨号
        </button>
        <button onClick={openXiaoke} type="button" className="rounded border px-3 py-2 text-xs hover:bg-slate-50">
          打开销氪
        </button>
      </div>

      <div className="rounded border border-dashed p-2">
        <p className="mb-2 text-xs font-medium text-slate-600">一键通话记录（常用）</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {COMMON_CALL_LOG_TEMPLATES.map((item) => (
            <button
              key={item.key}
              type="button"
              disabled={loading}
              onClick={() => quickLog(item.key)}
              className="rounded bg-slate-900 px-2 py-2 text-xs text-white disabled:opacity-60"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form action={onSubmit} className="space-y-2">
        <input type="hidden" name="customer_id" value={customerId} />
        <select name="status" defaultValue={defaultStatus} className="w-full rounded border px-2 py-1">
          {CUSTOMER_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <textarea
          name="note"
          defaultValue={defaultNote || ""}
          className="w-full rounded border px-2 py-1"
          rows={2}
          placeholder="备注"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="wechat_added" defaultChecked={defaultWechatAdded} />
          已加微信
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="interested" defaultChecked={defaultInterested} />
          有意向
        </label>
        <button
          disabled={loading}
          type="submit"
          className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
        >
          {loading ? "保存中..." : "手动保存"}
        </button>
      </form>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}
