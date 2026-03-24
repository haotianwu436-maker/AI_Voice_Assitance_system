import { AppShell } from "@/components/layout/app-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      title="管理后台"
      items={[
        { href: "/admin/customers", label: "客户管理" },
        { href: "/admin/import", label: "导入客户" },
        { href: "/admin/assign", label: "客户分配" },
        { href: "/admin/stats", label: "统计看板" }
      ]}
    >
      {children}
    </AppShell>
  );
}
