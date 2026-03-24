import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/constants/roles";

export async function getUserRole(userId: string): Promise<AppRole | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data.role;
}
