"use client";

import { useState } from "react";

type Sales = { id: string; name: string };
type Customer = { id: string; phone: string; name: string | null; assigned_to: string | null };

export function AssignPanel({ salesUsers, customers }: { salesUsers: Sales[]; customers: Customer[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function autoAssign() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/assign-customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "auto" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "分配失败");
      setMessage(`均分完成，更新 ${data.updated} 条`);
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "分配失败");
    } finally {
      setLoading(false);
    }
  }

  async function manualAssign(customerId: string, assignedTo: string | null) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/assign-customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "manual", customerId, assignedTo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "分配失败");
      setMessage("手动分配成功");
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "分配失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <button
          disabled={loading}
          onClick={autoAssign}
          className="rounded bg-slate-900 px-3 py-2 text-sm text-white"
        >
          {loading ? "处理中..." : "一键平均分配未分配客户"}
        </button>
        {message ? <p className="mt-2 text-sm text-slate-500">{message}</p> : null}
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">手机号</th>
              <th className="px-3 py-2 text-left">姓名</th>
              <th className="px-3 py-2 text-left">当前归属</th>
              <th className="px-3 py-2 text-left">手动分配</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.phone}</td>
                <td className="px-3 py-2">{c.name || "-"}</td>
                <td className="px-3 py-2">
                  {salesUsers.find((s) => s.id === c.assigned_to)?.name || "未分配"}
                </td>
                <td className="px-3 py-2">
                  <select
                    defaultValue={c.assigned_to || ""}
                    onChange={(e) => manualAssign(c.id, e.target.value || null)}
                    className="rounded border px-2 py-1"
                  >
                    <option value="">未分配</option>
                    {salesUsers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
