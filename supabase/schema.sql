-- Lumen — schema, RLS, and helpers
-- Run in the Supabase SQL editor (or via the CLI) on a fresh project.

create extension if not exists "pgcrypto";

-- ---------- Profiles (role lives here) ----------
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

-- ---------- Catalog ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price integer not null,            -- cents
  compare_at_price integer,
  currency text not null default 'USD',
  image_url text not null,
  gallery jsonb,
  category_id uuid references categories(id) on delete set null,
  stock integer not null default 0,
  featured boolean not null default false,
  rating numeric not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references auth.users on delete set null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------- Agency content ----------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client text not null,
  category text not null,
  summary text not null,
  cover_url text not null,
  gallery jsonb,
  year integer not null,
  services jsonb,
  featured boolean not null default false
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  avatar_url text not null,
  socials jsonb,
  sort_order integer not null default 0
);

create table if not exists service_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text not null,
  price integer not null default 0,  -- cents, 0 = custom
  billing text not null default 'project',
  features jsonb not null default '[]',
  popular boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_url text not null,
  author text not null,
  tag text not null,
  read_minutes integer not null default 5,
  published_at timestamptz not null default now()
);

-- ---------- Commerce + leads ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  email text not null,
  status text not null default 'pending' check (status in ('pending','paid','fulfilled','cancelled')),
  total integer not null,
  currency text not null default 'USD',
  items jsonb not null,
  shipping_name text,
  shipping_address text,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

-- ---------- Fulfilment network ----------
-- Who can ship what, at what cost. Kept separate from the catalog so a supplier
-- can be swapped or deactivated without touching products or orders.

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- 'api' is machine-integrated; the rest are human channels so a supplier with
  -- no software can still receive orders.
  channel_type text not null default 'manual' check (channel_type in ('api','email','sheet','manual')),
  contact text not null,
  lead_time_days integer not null default 3,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products on delete cascade,
  supplier_id uuid not null references suppliers on delete cascade,
  cost integer not null,
  -- Lower wins during routing. Not cost-based: lead time and reliability are
  -- expressed here, not inferred from price.
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, supplier_id)
);

create table if not exists fulfillments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders on delete cascade,
  supplier_id uuid not null references suppliers on delete restrict,
  -- Line items with unit cost snapshotted at routing time, so renegotiating a
  -- supplier price never restates margin on past orders.
  items jsonb not null,
  cost_total integer not null,
  status text not null default 'pending' check (status in ('pending','sent','shipped','delivered','failed')),
  tracking text,
  created_at timestamptz not null default now()
);

create index if not exists fulfillments_order_id_idx on fulfillments (order_id);
create index if not exists matches_product_id_idx on matches (product_id);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  budget text,
  service text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- Auto-create profile on signup ----------
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create or replace function is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- RLS ----------
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table reviews enable row level security;
alter table projects enable row level security;
alter table team_members enable row level security;
alter table service_packages enable row level security;
alter table blog_posts enable row level security;
alter table orders enable row level security;
alter table inquiries enable row level security;
alter table suppliers enable row level security;
alter table matches enable row level security;
alter table fulfillments enable row level security;

-- Policies are dropped first so this file is safe to re-run (Postgres has no
-- "create policy if not exists").

-- Public read for catalog & marketing content
drop policy if exists "public read" on categories;
create policy "public read" on categories for select using (true);
drop policy if exists "public read" on products;
create policy "public read" on products for select using (true);
drop policy if exists "public read" on reviews;
create policy "public read" on reviews for select using (true);
drop policy if exists "public read" on projects;
create policy "public read" on projects for select using (true);
drop policy if exists "public read" on team_members;
create policy "public read" on team_members for select using (true);
drop policy if exists "public read" on service_packages;
create policy "public read" on service_packages for select using (true);
drop policy if exists "public read" on blog_posts;
create policy "public read" on blog_posts for select using (true);

-- Admin writes catalog & content
drop policy if exists "admin write" on categories;
create policy "admin write" on categories for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write" on products;
create policy "admin write" on products for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write" on projects;
create policy "admin write" on projects for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write" on team_members;
create policy "admin write" on team_members for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write" on service_packages;
create policy "admin write" on service_packages for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write" on blog_posts;
create policy "admin write" on blog_posts for all using (is_admin()) with check (is_admin());

-- Fulfilment network: admin-only, with no public read policy at all. Supplier
-- costs are the margin — leaking them through the anon key would publish exactly
-- what the business pays for every product it sells.
drop policy if exists "admin all" on suppliers;
create policy "admin all" on suppliers for all using (is_admin()) with check (is_admin());
drop policy if exists "admin all" on matches;
create policy "admin all" on matches for all using (is_admin()) with check (is_admin());
drop policy if exists "admin all" on fulfillments;
create policy "admin all" on fulfillments for all using (is_admin()) with check (is_admin());

-- Reviews: any authenticated user can write their own
drop policy if exists "auth insert review" on reviews;
create policy "auth insert review" on reviews for insert with check (auth.uid() = user_id);

-- Profiles: self read/update; admins read all
drop policy if exists "self read profile" on profiles;
create policy "self read profile" on profiles for select using (auth.uid() = id or is_admin());
drop policy if exists "self update profile" on profiles;
create policy "self update profile" on profiles for update using (auth.uid() = id);

-- Orders: customers see their own; admins see all. Inserts via service role (webhook) bypass RLS.
drop policy if exists "own orders" on orders;
create policy "own orders" on orders for select using (auth.uid() = user_id or is_admin());
drop policy if exists "admin update orders" on orders;
create policy "admin update orders" on orders for update using (is_admin()) with check (is_admin());

-- Inquiries: anyone may submit; only admins read.
drop policy if exists "public insert inquiry" on inquiries;
create policy "public insert inquiry" on inquiries for insert with check (true);
drop policy if exists "admin read inquiry" on inquiries;
create policy "admin read inquiry" on inquiries for select using (is_admin());
