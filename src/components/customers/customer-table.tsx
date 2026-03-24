import { StatusBadge } from "@/components/ui/badge";

type CustomerRow = {
  id: string;
  phone: string;
  name: string | null;
  note: string | null;
  status: "未拨打" | "未接通" | "已接通" | "已加微信" | "有意向" | "无意向";
  wechat_added: boolean;
  interested: boolean;
  assigned_to?: string | null;
};

export function CustomerTable({
  rows,
  actions
}: {
  rows: CustomerRow[];
  actions?: (customer: CustomerRow) => React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-3 py-2">手机号</th>
            <th className="px-3 py-2">姓名</th>
            <th className="px-3 py-2">状态</th>
            <th className="px-3 py-2">加微信</th>
            <th className="px-3 py-2">有意向</th>
            <th className="px-3 py-2">备注</th>
            {actions ? <th className="px-3 py-2">操作</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-3 py-2">{item.phone}</td>
              <td className="px-3 py-2">{item.name || "-"}</td>
              <td className="px-3 py-2">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-3 py-2">{item.wechat_added ? "是" : "否"}</td>
              <td className="px-3 py-2">{item.interested ? "是" : "否"}</td>
              <td className="max-w-xs truncate px-3 py-2">{item.note || "-"}</td>
              {actions ? <td className="px-3 py-2">{actions(item)}</td> : null}
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-10 text-center text-slate-400">
                暂无数据
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
