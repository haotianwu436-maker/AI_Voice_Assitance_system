"use client";

import { useState } from "react";

export function ImportUpload() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/import-customers", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "导入失败");
      setMessage(`导入完成：有效行 ${data.totalRows}，无效行 ${data.invalidRows.length}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "导入失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded-lg border bg-white p-4">
      <p className="text-sm text-slate-600">支持 xlsx/xls，必须包含列：phone，name，note。</p>
      <input name="file" type="file" accept=".xlsx,.xls" required className="block w-full text-sm" />
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-slate-900 px-3 py-2 text-sm text-white"
      >
        {loading ? "导入中..." : "开始导入"}
      </button>
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
    </form>
  );
}
