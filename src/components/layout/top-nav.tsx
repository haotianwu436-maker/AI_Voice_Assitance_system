import { signOutAction } from "@/app/(auth)/login/actions";

export function TopNav({ title }: { title: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      <form action={signOutAction}>
        <button type="submit" className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">
          退出登录
        </button>
      </form>
    </header>
  );
}
