type Stat = {
  name: string;
  total: number;
  uncalled: number;
  connected: number;
  wechat: number;
  interested: number;
};

export function StatsCards({ items }: { items: Stat[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left">销售</th>
            <th className="px-3 py-2 text-left">总客户数</th>
            <th className="px-3 py-2 text-left">未拨打</th>
            <th className="px-3 py-2 text-left">已接通</th>
            <th className="px-3 py-2 text-left">已加微信</th>
            <th className="px-3 py-2 text-left">有意向</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.name} className="border-t">
              <td className="px-3 py-2">{it.name}</td>
              <td className="px-3 py-2">{it.total}</td>
              <td className="px-3 py-2">{it.uncalled}</td>
              <td className="px-3 py-2">{it.connected}</td>
              <td className="px-3 py-2">{it.wechat}</td>
              <td className="px-3 py-2">{it.interested}</td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-8 text-center text-slate-400">
                暂无统计数据
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
