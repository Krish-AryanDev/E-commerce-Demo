-- ============================================================================
-- NOVA storefront — initial schema
-- Run this in the Supabase SQL editor (or via the Supabase CLI) once.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Catalog
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  tagline     text,
  image       text,
  position    int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  brand          text,
  category_id    uuid references public.categories (id) on delete set null,
  tagline        text,
  description    text,
  price          numeric(10, 2) not null,
  original_price numeric(10, 2),
  rating         numeric(2, 1) not null default 0,
  reviews        int not null default 0,
  is_new         boolean not null default false,
  highlights     text[] not null default '{}',
  created_at     timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);

create table if not exists public.product_colors (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products (id) on delete cascade,
  name        text not null,
  hex         text not null,
  position    int  not null default 0
);

create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products (id) on delete cascade,
  url         text not null,
  position    int  not null default 0
);

-- ----------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Cart (one open cart per user)
-- ----------------------------------------------------------------------------
create table if not exists public.carts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users (id) on delete cascade,
  updated_at  timestamptz not null default now()
);

create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     uuid not null references public.carts (id) on delete cascade,
  product_id  uuid not null references public.products (id) on delete cascade,
  color       text,
  quantity    int not null default 1 check (quantity > 0),
  unique (cart_id, product_id, color)
);

-- ----------------------------------------------------------------------------
-- Orders
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  status      text not null default 'paid',
  subtotal    numeric(10, 2) not null,
  tax         numeric(10, 2) not null,
  shipping    numeric(10, 2) not null default 0,
  total       numeric(10, 2) not null,
  created_at  timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  product_id  uuid references public.products (id) on delete set null,
  name        text not null,
  color       text,
  price       numeric(10, 2) not null,
  quantity    int not null
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_images enable row level security;
alter table public.profiles       enable row level security;
alter table public.carts          enable row level security;
alter table public.cart_items     enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;

-- Catalog: world-readable
create policy "Catalog is publicly readable"
  on public.categories for select using (true);
create policy "Products are publicly readable"
  on public.products for select using (true);
create policy "Product colors are publicly readable"
  on public.product_colors for select using (true);
create policy "Product images are publicly readable"
  on public.product_images for select using (true);

-- Profiles: owner only
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Carts: owner only
create policy "Users manage own cart"
  on public.carts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own cart items"
  on public.cart_items for all
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_items.cart_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.carts c
      where c.id = cart_items.cart_id and c.user_id = auth.uid()
    )
  );

-- Orders: owner can read + create their own
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);
create policy "Users can create own orders"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
create policy "Users can create own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
