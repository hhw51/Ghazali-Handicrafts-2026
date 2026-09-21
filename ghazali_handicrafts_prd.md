# Product Requirements Document (PRD)

**Project Name:** Ghazali Handicrafts  
**Document Version:** 1.0.0  
**Target Platform:** Web (Desktop & Mobile Responsive)  
**Primary Tech Stack:** Next.js (App Router, TypeScript), Supabase (PostgreSQL, Storage, Auth), Tailwind CSS, shadcn/ui  

---

## 1. Executive Summary & Vision

Ghazali Handicrafts is an artisanal e-commerce web platform dedicated to authentic Pakistani cultural heritage crafts (Multani blue pottery, Swati carved woodwork, marble chess sets, chiseled brass, and truck art). The platform rejects generic, sterile digital aesthetics in favor of an **organic luxury heritage brand identity**. 

Operationally, the platform is engineered to address local e-commerce realities: high Cash on Delivery (COD) adoption, fraudulent orders, variable volumetric weights for fragile items, city-level courier mapping, and headless WhatsApp automation.

---

## 2. Brand Identity & Design System

### 2.1 Color Tokens (`globals.css`)
```css
:root {
  --background: #FAF7F2;         /* Parchment / Raw Ivory */
  --card: #F4EFE6;               /* Bleached Sandstone */
  --primary-accent: #1A4268;     /* Multani Cobalt / Lapis Glaze */
  --secondary-accent: #8F3B1B;   /* Fired Terracotta */
  --highlight: #C5A059;          /* Antiqued Brass / Chiseled Gold */
  --foreground: #1F1D1A;         /* Charcoal Umber */
  --muted: #6E675F;              /* Aged Stone */
  --border: #E6DFD5;             /* Raw Chiseled Edge */
}
```

### 2.2 Typography & UI Rules
* **Headings / Display:** `Cormorant Garamond` or `Cinzel` (Editorial Serif).
* **Body & Technical UI:** `Plus Jakarta Sans` or `Inter` (Geometric Sans).
* **Visual Direction:** No hyper-saturated gradient buttons or AI-template pill containers. Use subtle borders, authentic paper textures, asymmetric layouts, and smooth micro-interactions via Framer Motion.

---

## 3. Scope & Page Blueprint Specifications

### 3.1 Home Page (`/`)
* **Hero Section:** Asymmetric split: editorial typography + badge on the left; curated high-res showcase with gentle scroll-parallax on the right.
* **Artisan Heritage Ticker:** Running strip highlighting craft regions (Multan, Swat, Chiniot, Peshawar).
* **Featured Curations:** 3-column asymmetric masonry grid rather than uniform squares.
* **Heritage Spotlight:** "From Raw Clay to Kiln" dual-image comparison slider or video breakdown.
* **Trust Anchors:** 3 minimal icons: *Fragile-Safe Packaging*, *Authentic Artisan Direct*, *Nationwide COD Delivery*.

### 3.2 Product Listing Page / PLP (`/products`)
* **Header:** Cultural overview banner with short provenance descriptions.
* **Search & Autocomplete:** Sticky pill search utilizing PostgreSQL `pg_trgm` fuzzy matching (RPC).
* **Faceted Filtering (Sidebar/Drawer):** Material (Clay, Walnut Wood, Marble, Brass), Price Slider (PKR), Availability (In Stock only), and Category tabs.
* **Product Grid:** 4-column desktop, 2-column mobile. High-aspect-ratio cards (`aspect-[4/5]`) with second-image hover reveal, stock status badge, and quick "Add to Cart" trigger.

### 3.3 Product Detail Page / PDP (`/products/[slug]`)
* **Media Gallery:** Left-aligned sticky gallery (stacked vertical on desktop, swipeable carousel with indicator dots on mobile).
* **Commerce Rail:** Title in serif, formatted PKR price, regional provenance tag, short description callout directly below image previews, binary stock tag (`In Stock` vs `Sold Out`).
* **Action Triggers:** Primary button: "Order via Cash on Delivery"; secondary button: "Inquire via WhatsApp" (deep-linked with product SKU and URL).
* **Artisan Accordion:** Radix-powered accordions for *Craft Heritage & Provenance*, *Dimensions & Weight*, and *Fragile Care Instructions*.
* **JSON-LD Structured Data:** Embedded `Product`, `AggregateRating`, and `Offer` schema for Google Shopping optimization.

### 3.4 Cart Drawer & Cart Page (`/cart`)
* **Format:** Global slide-over drawer backed by a Zustand persistent store (`localStorage`).
* **Card Anatomy:** Thumbnail, title, selected size/color, quantity adjuster, subtotal, and dynamic threshold progress bar (*"Add Rs. X more for Free Shipping"*).
* **Stock Guard:** Disallow incrementing if `in_stock === false`.

### 3.5 Checkout Page (`/checkout`)
* **Design:** Distraction-free 2-column single-page layout (nav/footer stripped to trust logos).
* **Column 1: Order Form:**
  1. *Phone & OTP Verification:* Input phone number $\rightarrow$ triggers 4-digit OTP via SendPK API $\rightarrow$ inline verification.
  2. *Recipient Details:* Full name and email (optional for receipts).
  3. *Structured Destination:* Strictly mapped City dropdown (standardized for Trax/PostEx/Leopards) + detailed Area/Street input + Landmark.
  4. *Payment Selection:* "Cash on Delivery (COD)" active by default; radio placeholders for "Debit/Credit Card" and "JazzCash / EasyPaisa" marked as *(Coming Soon)*.
* **Column 2: Sticky Order Summary:** Itemized breakdown, calculated weight, shipping tariff, discount code input, and final payable amount in PKR.

### 3.6 Reviews & Authenticity (`/reviews`)
* **Aggregate Scorecard:** Average rating card with total customer verification counts.
* **Filter Bar:** Filter by craft category and toggle for "Reviews with Photos".
* **Review Card:** Star rating, reviewer city, verified badge, real customer photo, and pinned product link.

### 3.7 Admin Dashboard (`/admin/*`)
* **Authentication:** Supabase Auth with RBAC (Role-Based Access Control) enforced via Next.js Middleware.
* **Product & Stock Management:** Data table with real-time toggle for `in_stock` (true/false) and price overrides.
* **Bulk Google Sheet / Excel Ingestion:** Drag-and-drop file upload parsing `.xlsx` / `.csv` using ExcelJS. Features a client-side validation preview table before executing atomic Supabase upserts.
* **Order Operations Pipeline:** Kanban/Table view tracking status states: `pending_verification` $\rightarrow$ `verified` $\rightarrow$ `booked_with_courier` $\rightarrow$ `dispatched` $\rightarrow$ `delivered` / `returned`.

---

## 4. Technical Architecture & Database Schema

### 4.1 System Component Matrix

| Tier | Technology Choice | Responsibility |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ (App Router, React Server Components) | SSR/ISR routing, SEO rendering, and Server Actions. |
| **Styling & UI** | Tailwind CSS + shadcn/ui + Framer Motion | Design tokens, accessible headless primitives, animations. |
| **Client State** | Zustand (`persist` middleware) | Cart state, drawer visibility, client-side session preferences. |
| **Database** | Supabase (PostgreSQL 15+) | Relational tables, full-text search, RLS policies, indexing. |
| **File Storage** | Supabase Storage (`inventory` bucket) | High-res product images, customer review photos. |
| **Data Parsing** | ExcelJS + Zod | Strict schema validation and batch ingestion. |
| **Communication**| Baileys (`@whiskeysockets/baileys`) | Headless WhatsApp bot for confirmations and support. |
| **SMS Gateway** | SendPK HTTP API | OTP verification for COD fraud reduction. |

---

### 4.2 Database DDL (Supabase SQL)

```sql
-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Categories Table
create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Products Table (Directly mapped to Google Sheet columns)
create table public.products (
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

-- Orders Table
create type order_status as enum (
  'pending_verification', 
  'verified', 
  'booked_with_courier', 
  'dispatched', 
  'delivered', 
  'cancelled', 
  'returned'
);

create table public.orders (
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

-- Order Items Table
create table public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete restrict not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric(10,2) not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Indexes for Fast Queries and Fuzzy Search
create index idx_products_category on public.products(category_id);
create index idx_products_in_stock on public.products(in_stock);
create index idx_products_search on public.products using gin (
    (name || ' ' || coalesce(short_description, '') || ' ' || coalesce(long_description, '')) gin_trgm_ops
);

-- Timestamp Trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();
```

---

## 5. Google Sheet Ingestion Specification

The system accepts `.xlsx` / `.csv` imports structured around the following column definitions:

| Column Name | Type | Processing Rule |
| :--- | :--- | :--- |
| `name` | String | Required. Generates unique URL slug using `slugify`. |
| `long description` | String | Formatted text for PDP tabs. |
| `price` | Number | Strips non-numeric characters, parses as positive float. |
| `short description (underneath product picture)` | String | Rendered beneath the product image carousel. |
| `size` | String | Raw display string (e.g., `"12x8 inches"`). |
| `stock` | String | Parsed to Boolean: `"yes"`, `"true"`, `"in stock"` $\rightarrow$ `true`; all else $\rightarrow$ `false`. |
| `images` | String (Array) | Comma-separated public URLs parsed into `text[]`. |
| `colors` | String | Comma-separated color names (e.g., `"Multani Blue, White"`). |
| `category` | String | Upserts parent category automatically if not found. |
| `weight` | Number | Normalized to kg/grams for courier tariff computation. |
| `tags` | String (Array) | Comma-separated tags lowercased for search filtering. |

### 5.1 Zod Validation Schema (`lib/validations/product.ts`)
```typescript
import { z } from 'zod';

export const sheetProductRowSchema = z.object({
  name: z.string().min(2, "Name is required"),
  'long description': z.string().optional().default(""),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val),
    z.number().positive("Price must be greater than 0")
  ),
  'short description (underneath product picture)': z.string().optional().default(""),
  size: z.string().optional().default(""),
  stock: z.preprocess((val) => {
    if (typeof val === 'string') {
      const lower = val.trim().toLowerCase();
      return lower === 'yes' || lower === 'in stock' || lower === 'true';
    }
    return Boolean(val);
  }, z.boolean()),
  images: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      return val.split(',').map((url) => url.trim()).filter(Boolean);
    }
    return [];
  }, z.array(z.string().url("Must be valid image URLs"))),
  colors: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
  weight: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val || 0),
    z.number().nonnegative().default(0)
  ),
  tags: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      return val.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    }
    return [];
  }, z.array(z.string()))
});
```

---

## 6. Implementation Roadmap for AI Agent

```
Phase 1: Foundation & Infrastructure
  ├── Initialize Next.js 15 (TypeScript, Tailwind CSS, shadcn/ui, App Router)
  ├── Configure Supabase client & execute database schema migration
  └── Establish brand design tokens, typography, and base layout templates

Phase 2: Product Catalog & State Management
  ├── Build Category and Product Server Components with Next.js ISR
  ├── Implement Fuzzy Search RPC API in Supabase
  ├── Implement Zustand Cart Store with localStorage persistence
  ├── Develop PLP with faceted sidebar filters
  └── Develop PDP with image gallery, accordion, and WhatsApp query action

Phase 3: Checkout, OTP & Verification Engine
  ├── Build single-page checkout form with strict City selection
  ├── Implement SendPK OTP Server Action (generate, send, verify 4-digit code)
  ├── Construct atomic checkout Server Action (recalculate total, lock stock, commit order)
  └── Wire Baileys headless bot to trigger order confirmation WhatsApp ping

Phase 4: Admin Suite & Bulk Ingestion
  ├── Setup Supabase Auth with Next.js middleware protection for `/admin/*`
  ├── Build Excel drag-and-drop component using ExcelJS + Zod validation preview
  ├── Build atomic bulk upsert Server Action
  └── Build Order Management dashboard with status update state machine

Phase 5: SEO, Performance & Launch Readiness
  ├── Configure metadata generation, sitemap.ts, and robots.ts
  ├── Embed JSON-LD rich snippets on all PDP routes
  └── Image optimization via Next.js <Image /> and Supabase WebP transformations
```