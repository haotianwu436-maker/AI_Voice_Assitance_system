import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import type { AppRole } from "@/lib/constants/roles";

async function getRoleByUserId(
  supabase: ReturnType<typeof updateSession>["supabase"],
  userId: string
): Promise<AppRole | null> {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return (data?.role as AppRole | undefined) || null;
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request);
  const pathname = request.nextUrl.pathname;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAuthPage = pathname.startsWith("/login");
  const isAdminPage = pathname.startsWith("/admin");
  const isSalesPage = pathname.startsWith("/sales");

  if (!user && (isAdminPage || isSalesPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthPage) {
    const role = await getRoleByUserId(supabase, user.id);
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "sales") return NextResponse.redirect(new URL("/sales", request.url));
  }

  if (user && (isAdminPage || isSalesPage)) {
    const role = await getRoleByUserId(supabase, user.id);

    if (!role) {
      return NextResponse.redirect(new URL("/login?error=未分配角色", request.url));
    }
    if (isAdminPage && role !== "admin") {
      return NextResponse.redirect(new URL("/sales", request.url));
    }
    if (isSalesPage && role !== "sales") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
