# NOVA — Supabase setup

The storefront runs **without** Supabase out of the box (it falls back to the
local seed catalog in `lib/seed-data.js`). Follow these steps to switch it onto
a live Supabase backend with auth, a server-side cart and orders.

## 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com). Then grab your keys
from **Project Settings → API**:

- Project URL
- `anon` public key
- `service_role` secret key (server-only)

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

As soon as these are real (not the placeholders), the app automatically starts
using Supabase instead of the seed fallback.

## 3. Create the schema

In the Supabase dashboard open **SQL Editor**, paste the contents of
`supabase/migrations/0001_init.sql`, and run it. This creates the tables
(`categories`, `products`, `product_colors`, `product_images`, `profiles`,
`carts`, `cart_items`, `orders`, `order_items`), enables Row Level Security with
the right policies, and adds a trigger that creates a `profiles` row on signup.

## 4. Seed the catalog

```bash
npm run seed
```

This reads `lib/seed-data.js` and upserts the categories and products using the
service-role key. Safe to re-run.

## 5. Run it

```bash
npm run dev
```

- Browse the catalog (now served from Supabase).
- Create an account at `/signup`. By default Supabase requires email
  confirmation — disable it under **Authentication → Providers → Email** if you
  want instant sign-in while developing.
- Add items to your bag — when signed in, the cart persists to the `carts` /
  `cart_items` tables and merges any guest cart on login.
- Check out from `/cart` to create an order, then view it at
  `/account/orders`.

## Architecture notes

- **Data layer** — `lib/products.js` exposes async functions used by **both**
  Server Components and the Route Handlers under `app/api/*`. Each function
  prefers Supabase and falls back to seed data when it isn't configured.
- **Auth** — cookie-based sessions via `@supabase/ssr`. `middleware.js` keeps
  the session fresh and guards `/account/*`.
- **Clients** — `lib/supabase/client.js` (browser), `lib/supabase/server.js`
  (Server Components / Route Handlers, bound to request cookies), and
  `lib/supabase/admin.js` (service role, server-only, used by the seed script).
- **Security** — all order/cart/profile access is enforced by RLS keyed to
  `auth.uid()`; checkout totals are recomputed server-side and never trusted
  from the client.

## API reference (Route Handlers)

| Method | Route                  | Auth | Description                        |
| ------ | ---------------------- | ---- | ---------------------------------- |
| GET    | `/api/products`        | —    | All products (`?category=` filter) |
| GET    | `/api/products/:slug`  | —    | Single product                     |
| GET    | `/api/categories`      | —    | All categories                     |
| GET    | `/api/cart`            | user | Current user's cart lines          |
| PUT    | `/api/cart`            | user | Replace cart contents              |
| POST   | `/api/checkout`        | user | Create an order from the cart      |
