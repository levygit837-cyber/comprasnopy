-- Viana Pharmacy — initial schema.
-- Profiles (extends auth.users), catalog (categories, products, variants,
-- images), exchange rates, and orders. All tables have RLS enabled and
-- default-deny policies; public reads on the catalog are explicit.

-- ─────────────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  full_name text generated always as (
    trim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))
  ) stored,
  phone text,
  country text default 'PY',
  marketing_opt_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_phone_idx on public.profiles (phone);

alter table public.profiles enable row level security;

drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Insert a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, country, marketing_opt_in)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', null),
    coalesce(new.raw_user_meta_data ->> 'last_name', null),
    coalesce(new.raw_user_meta_data ->> 'phone', null),
    coalesce(new.raw_user_meta_data ->> 'country', 'PY'),
    coalesce((new.raw_user_meta_data ->> 'marketing_opt_in')::boolean, true)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh on profile edits.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- categories
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id text primary key,
  slug text not null unique,
  icon text not null,
  tint text not null check (tint in ('cool', 'warm', 'sage')),
  name_es text not null,
  name_pt text not null,
  name_en text not null
);

alter table public.categories enable row level security;

drop policy if exists "categories public select" on public.categories;
create policy "categories public select"
  on public.categories for select
  using (true);

-- ─────────────────────────────────────────────────────────────────────
-- products
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  category_id text not null references public.categories (id) on delete restrict,
  name_es text not null,
  name_pt text not null,
  name_en text not null,
  desc_es text not null,
  desc_pt text not null,
  desc_en text not null,
  price_usd numeric(10, 2) not null check (price_usd >= 0),
  old_price_usd numeric(10, 2) check (old_price_usd >= 0),
  image text not null,
  featured boolean not null default false,
  lab text,
  variant_group text,
  strength text,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_featured_idx on public.products (featured) where featured = true;
create index if not exists products_variant_group_idx on public.products (variant_group);
create index if not exists products_price_idx on public.products (price_usd);

alter table public.products enable row level security;

drop policy if exists "products public select" on public.products;
create policy "products public select"
  on public.products for select
  using (true);

-- ─────────────────────────────────────────────────────────────────────
-- product_images (optional gallery per product)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products (id) on delete cascade,
  src text not null,
  position int not null default 0
);

create index if not exists product_images_product_idx
  on public.product_images (product_id, position);

alter table public.product_images enable row level security;

drop policy if exists "product_images public select" on public.product_images;
create policy "product_images public select"
  on public.product_images for select
  using (true);

-- ─────────────────────────────────────────────────────────────────────
-- exchange_rates
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.exchange_rates (
  currency text primary key check (currency in ('USD', 'BRL', 'PYG')),
  rate numeric(12, 4) not null check (rate > 0),
  updated_at timestamptz not null default now()
);

alter table public.exchange_rates enable row level security;

drop policy if exists "exchange_rates public select" on public.exchange_rates;
create policy "exchange_rates public select"
  on public.exchange_rates for select
  using (true);

-- ─────────────────────────────────────────────────────────────────────
-- orders / order_lines
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'completed', 'cancelled')),
  total_usd numeric(12, 2) not null check (total_usd >= 0),
  currency text not null default 'USD'
    check (currency in ('USD', 'BRL', 'PYG')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

drop policy if exists "orders self select" on public.orders;
create policy "orders self select"
  on public.orders for select
  using (auth.uid() = user_id);

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

create table if not exists public.order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text references public.products (id) on delete set null,
  name text not null,
  strength text,
  qty int not null check (qty > 0),
  price_usd numeric(10, 2) not null check (price_usd >= 0)
);

create index if not exists order_lines_order_idx on public.order_lines (order_id);

alter table public.order_lines enable row level security;

drop policy if exists "order_lines via order" on public.order_lines;
create policy "order_lines via order"
  on public.order_lines for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_lines.order_id
        and o.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────
-- updated_at on orders lines trigger is unnecessary (no updated_at).
-- ─────────────────────────────────────────────────────────────────────
