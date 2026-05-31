-- ============================================================================
-- Add the `brand` column to products.
-- Run this if you already applied 0001_init.sql before the brand field existed.
-- (0001 now includes the column, so fresh installs can skip this.)
-- ============================================================================

alter table public.products
  add column if not exists brand text;

create index if not exists products_brand_idx on public.products (brand);
