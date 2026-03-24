import { signInAction } from "./actions";

type Props = {
  searchParams: {
    error?: string;
  };
};

export default function LoginPage({ searchParams }: Props) {
  const error = searchParams.error;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">外呼助手系统</h1>
        <p className="mt-1 text-sm text-slate-500">请使用企业账号登录</p>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        <form action={signInAction} className="mt-5 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            登录
          </button>
        </form>
      </div>
    </main>
  );
}
