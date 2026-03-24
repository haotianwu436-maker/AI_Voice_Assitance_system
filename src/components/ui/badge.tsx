import type { CustomerStatus } from "@/lib/constants/customer-status";

const statusColorMap: Record<CustomerStatus, string> = {
  未拨打: "bg-slate-100 text-slate-700",
  未接通: "bg-amber-100 text-amber-700",
  已接通: "bg-blue-100 text-blue-700",
  已加微信: "bg-cyan-100 text-cyan-700",
  有意向: "bg-emerald-100 text-emerald-700",
  无意向: "bg-rose-100 text-rose-700"
};

export function StatusBadge({ status }: { status: CustomerStatus }) {
  return <span className={`rounded px-2 py-1 text-xs ${statusColorMap[status]}`}>{status}</span>;
}
