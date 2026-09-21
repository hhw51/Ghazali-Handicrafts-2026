# Antigravity Operational Rules — Ghazali Handicrafts

## 1. Architectural Invariants
- **Runtime:** Next.js 15+ App Router with TypeScript (Strict mode enabled).
- **Component Model:** Prefer React Server Components (RSC) for product listings and detail pages. Use Client Components (`"use client"`) only where browser state or animation is strictly required (Cart, Checkout form, Search autocomplete, Filter drawers).
- **Styling:** Tailwind CSS utility classes exclusively. Reference variables mapped to `--background`, `--card`, `--primary-accent`, `--secondary-accent`, `--highlight`, `--foreground`, `--muted`, and `--border`.
- **Validation:** Always use Zod schemas located in `lib/validations/` for Server Actions, API routes, and Excel inputs.

## 2. Data Flow & Security
- **Cart & Pricing:** The client sends only `{ productId, quantity, variantId }`. Server Actions fetch real-time unit prices and stock from Supabase. Never accept a `total_amount` or `price` from the request body.
- **Stock Management:** Binary stock (`in_stock: boolean`). If an item is out of stock, disable the "Add to Cart" and "Order via COD" buttons, and prevent checkout submission server-side.
- **Admin Isolation:** All `/admin/*` routes must be guarded by Next.js Middleware checking Supabase user session and `role === 'admin'`.

## 3. Localization & Pakistan-Specific Logic
- **Courier & Shipping:** City input on checkout must be a controlled dropdown mapped to standard logistics hubs (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad, Abbottabad, etc.).
- **Phone & OTP Format:** Validate local phone numbers using E.164 (`+923XXXXXXXXX`) or local format (`03XXXXXXXXX`). Hash OTPs or save with `expires_at: now() + interval '5 minutes'`.
- **Currency Display:** Display currency formatted as `Rs. X,XXX` or `PKR X,XXX`.

## 4. Coding Conventions
- Group file structures by domain:
  - `actions/` for Next.js Server Actions (`orders.ts`, `auth.ts`, `products.ts`).
  - `components/ui/` for shadcn primitives.
  - `components/craft/` for domain-specific components (ArtisanAccordion, HeritageTicker, PriceDisplay).
  - `hooks/` for custom React hooks.
  - `lib/supabase/` for `client.ts`, `server.ts`, and `middleware.ts`.
  - `store/` for Zustand stores (`cart-store.ts`).
  - `types/` for TypeScript definitions (`product.ts`, `order.ts`).
## 5. Media & Asset Rules
- **Prohibition on Stock Photos:** Strict refusal of stock photo APIs or mock image generators (e.g., Unsplash, Placehold.co). Use solely the local assets cataloged in `/public/images/` or direct Supabase Storage URLs from authentic product sets.
- **Handling Real Uploads:**
  - Map the user-provided product photos directly into seed data and Supabase default records.
  - If a product record lacks an image array, fallback gracefully to the authenticated collection cover from `/public/images/collections/`, never an external dummy placeholder.