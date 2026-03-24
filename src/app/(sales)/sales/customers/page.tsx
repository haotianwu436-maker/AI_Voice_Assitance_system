import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerUpdateForm } from "@/components/customers/customer-update-form";
import { getCurrentUserProfile, getCustomers } from "@/lib/customers/repository";

type Props = {
  searchParams: {
    keyword?: string;
    status?: "未拨打" | "未接通" | "已接通" | "已加微信" | "有意向" | "无意向";
  };
};

export default async function SalesCustomersPage({ searchParams }: Props) {
  const profile = await getCurrentUserProfile();
  const rows = await getCustomers({
    assignedTo: profile?.id,
    keyword: searchParams.keyword,
    status: searchParams.status
  });

  return (
    <div className="space-y-4">
      <form className="flex gap-2">
        <input
          name="keyword"
          defaultValue={searchParams.keyword || ""}
          placeholder="搜索手机号/姓名"
          className="w-64 rounded border bg-white px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={searchParams.status || ""}
          className="rounded border bg-white px-3 py-2 text-sm"
        >
          <option value="">全部状态</option>
          <option value="未拨打">未拨打</option>
          <option value="未接通">未接通</option>
          <option value="已接通">已接通</option>
          <option value="已加微信">已加微信</option>
          <option value="有意向">有意向</option>
          <option value="无意向">无意向</option>
        </select>
        <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
          筛选
        </button>
      </form>

      <CustomerTable
        rows={rows}
        actions={(c) => (
          <CustomerUpdateForm
            customerId={c.id}
            phone={c.phone}
            defaultStatus={c.status}
            defaultNote={c.note}
            defaultWechatAdded={c.wechat_added}
            defaultInterested={c.interested}
          />
        )}
      />
    </div>
  );
}
