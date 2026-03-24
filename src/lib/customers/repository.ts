import { createClient } from "@/lib/supabase/server";
import type { CustomerStatus } from "@/lib/constants/customer-status";

export async function getCustomers(params?: {
  assignedTo?: string;
  status?: CustomerStatus;
  keyword?: string;
}) {
  const supabase = createClient();
  let query = supabase
    .from("customers")
    .select("id, phone, name, note, status, assigned_to, wechat_added, interested, updated_at")
    .order("updated_at", { ascending: false });

  if (params?.assignedTo) query = query.eq("assigned_to", params.assignedTo);
  if (params?.status) query = query.eq("status", params.status);
  if (params?.keyword) {
    const kw = params.keyword.trim();
    if (kw) query = query.or(`phone.ilike.%${kw}%,name.ilike.%${kw}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getSalesUsers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("role", "sales")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCurrentUserProfile() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("id", user.id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}
