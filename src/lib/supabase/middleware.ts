import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        request.cookies.set({
          name,
          value,
          ...(options || {})
        });

        response = NextResponse.next({ request });
        response.cookies.set({
          name,
          value,
          ...(options || {})
        });
      },
      remove(name: string, options: Record<string, unknown>) {
        request.cookies.set({
          name,
          value: "",
          ...(options || {})
        });

        response = NextResponse.next({ request });
        response.cookies.set({
          name,
          value: "",
          ...(options || {})
        });
      }
    }
  });

  return { supabase, response };
}
