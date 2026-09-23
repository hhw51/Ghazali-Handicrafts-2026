-- Ghazali Handicrafts — Database Initialization Script
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- 1. Categories
create table if not exists public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Products
create table if not exists public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    short_description text,
    long_description text,
    price numeric(10, 2) not null check (price >= 0),
    size text,
    in_stock boolean default true not null,
    images text[] default '{}' not null,
    colors text,
    category_id uuid references public.categories(id) on delete set null,
    weight numeric(8, 2) default 0.00,
    tags text[] default '{}' not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Orders & Order Items
create type order_status as enum (
  'pending_verification', 
  'verified', 
  'booked_with_courier', 
  'dispatched', 
  'delivered', 
  'cancelled', 
  'returned'
);

create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    customer_name text not null,
    customer_phone text not null,
    customer_email text,
    city text not null,
    address text not null,
    landmark text,
    subtotal numeric(10,2) not null,
    shipping_fee numeric(10,2) not null default 0.00,
    total_amount numeric(10,2) not null,
    payment_method text default 'COD' not null,
    status order_status default 'pending_verification' not null,
    otp_code text,
    otp_expires_at timestamptz,
    phone_verified boolean default false not null,
    notes text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric(10,2) not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Reviews
create table if not exists public.reviews (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    customer_name text not null,
    customer_city text,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    photo_urls text[] default '{}' not null,
    is_verified boolean default true not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. Full-Text Search Function & Indexing
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_in_stock on public.products(in_stock);
create index if not exists idx_products_search on public.products using gin (
    (name || ' ' || coalesce(short_description, '') || ' ' || coalesce(long_description, '')) gin_trgm_ops
);

-- Updated_at Trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();