create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('admin', 'sales');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.customer_status as enum ('未拨打', '未接通', '已接通', '已加微信', '有意向', '无意向');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role public.app_role not null default 'sales',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  name text,
  note text,
  status public.customer_status not null default '未拨打',
  assigned_to uuid null references public.profiles(id) on delete set null,
  wechat_added boolean not null default false,
  interested boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  phone_normalized text generated always as (regexp_replace(phone, '\D', '', 'g')) stored
);

create unique index if not exists customers_phone_normalized_unique_idx on public.customers(phone_normalized);
create index if not exists customers_assigned_to_idx on public.customers(assigned_to);
create index if not exists customers_status_idx on public.customers(status);

create table if not exists public.call_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.customer_status not null,
  remark text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists trg_customers_updated_at on public.customers;
create trigger trg_customers_updated_at before update on public.customers for each row execute function public.set_updated_at();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'sales')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
