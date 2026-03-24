import Link from "next/link";
import { TopNav } from "@/components/layout/top-nav";

type NavItem = { href: string; label: string };

export function AppShell({
  title,
  items,
  children
}: {
  title: string;
  items: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-56 border-r bg-white p-4">
        <h1 className="mb-4 text-sm font-bold">外呼助手系统</h1>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="flex-1">
        <TopNav title={title} />
        <main className="p-4">{children}</main>
      </section>
    </div>
  );
}
