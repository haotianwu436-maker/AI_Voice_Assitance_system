import { AppShell } from "@/components/layout/app-shell";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell title="销售工作台" items={[{ href: "/sales/customers", label: "我的客户" }]}>
      {children}
    </AppShell>
  );
}
