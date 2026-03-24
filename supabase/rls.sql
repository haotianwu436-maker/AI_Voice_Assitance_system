alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.call_logs enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin" on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin" on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles_insert_admin_only" on public.profiles;
create policy "profiles_insert_admin_only" on public.profiles
for insert to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "customers_select_sales_own_admin_all" on public.customers;
create policy "customers_select_sales_own_admin_all" on public.customers
for select to authenticated
using (assigned_to = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "customers_insert_admin_only" on public.customers;
create policy "customers_insert_admin_only" on public.customers
for insert to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "customers_update_sales_own_admin_all" on public.customers;
create policy "customers_update_sales_own_admin_all" on public.customers
for update to authenticated
using (assigned_to = auth.uid() or public.is_admin(auth.uid()))
with check (assigned_to = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "customers_delete_admin_only" on public.customers;
create policy "customers_delete_admin_only" on public.customers
for delete to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "call_logs_select_self_or_admin" on public.call_logs;
create policy "call_logs_select_self_or_admin" on public.call_logs
for select to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "call_logs_insert_self_or_admin" on public.call_logs;
create policy "call_logs_insert_self_or_admin" on public.call_logs
for insert to authenticated
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "call_logs_update_admin_only" on public.call_logs;
create policy "call_logs_update_admin_only" on public.call_logs
for update to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "call_logs_delete_admin_only" on public.call_logs;
create policy "call_logs_delete_admin_only" on public.call_logs
for delete to authenticated
using (public.is_admin(auth.uid()));
