# Brews Lee

A full-stack coffee shop online ordering system built with Next.js 14, Supabase, NextAuth.js, and Tailwind CSS.

## Overview

Brews Lee is a complete ordering platform for a modern independent café based in Palawan, Philippines. Customers can browse the menu, customize their orders, place orders, and track them in real time. The owner has a private dashboard to manage everything from menu items to live incoming orders.

**Design:** Minimalist and warm — cream, espresso brown, and caramel tones with a premium feel. Dark mode supported.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, Server Components, Server Actions) |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js v4 (Google OAuth + email/password) |
| Storage | Supabase Storage (menu item photos) |
| Realtime | Supabase Realtime |
| Styling | Tailwind CSS (dark mode via class strategy) |
| Cart State | Zustand (localStorage persistence) |
| Language | TypeScript |

---

## Features

### Customer
- Browse menu by category with search and filter
- Item customization (size, sugar level, temperature)
- Cart with quantity controls and drawer view
- Checkout with delivery address or pickup
- Cash payment only
- Real-time order tracking (Pending → Preparing → Ready)
- Order history with one-tap reorder
- Profile management with saved addresses

### Admin Dashboard
- Sales analytics (revenue, order count, best sellers)
- Category manager (create, rename, reorder, delete)
- Menu item manager (add/edit/delete, photo upload, sold-out toggle)
- Live orders view with status updates and Realtime notifications
- Promo banner manager (message + show/hide toggle)

---

## Test Accounts

Use these accounts to explore the app locally. Sign in at `/auth/login` using **email/password**.

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@brewslee.test` | `Brewslee123!` |
| Admin | `admin@brewslee.test` | `Brewslee123!` |

The **customer** account can browse the menu, place orders, and track them in real time.

The **admin** account has full access to `/dashboard` — manage orders, menu items, categories, and the promo banner.

---

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles linked to Supabase Auth |
| `addresses` | Saved delivery addresses per user |
| `categories` | Menu categories with sort order |
| `menu_items` | Menu items with price, photo, availability |
| `item_customizations` | Size/sugar/temperature options per item |
| `orders` | Customer orders with status and totals |
| `order_items` | Individual items within each order |
| `promo_banner` | Single-row promo announcement |

Row Level Security (RLS) is enabled on all tables. Customers can only access their own data. Menu, categories, and the promo banner are publicly readable.

---

## Project Structure

```
/app                        → Next.js App Router pages
  /page.tsx                 → Landing page
  /menu                     → Customer menu browsing
  /cart                     → Cart page
  /checkout                 → Checkout
  /order-confirmation       → Order confirmation
  /orders                   → Order history + real-time tracking
  /profile                  → Customer profile
  /auth/login               → Login page
  /dashboard                → Admin dashboard
  /api/auth/[...nextauth]   → NextAuth route handler
  /api/admin                → Admin-only API routes
  /api/orders               → Order placement API
  /api/profile              → Profile and address API
/components
  /ui                       → Reusable UI components (Button, Input, Badge, Modal)
  /layout                   → Navbar, Footer, PromoBanner
  /menu                     → MenuCard, CartDrawer, CustomizationModal
  /orders                   → ReorderButton
  /providers                → SessionProvider, ThemeProvider
/lib
  /supabase.ts              → Server/admin Supabase clients
  /supabase-browser.ts      → Browser Supabase client (client components)
  /auth.ts                  → NextAuth configuration
/types
  /index.ts                 → TypeScript types for all entities
/store
  /cart.ts                  → Zustand cart store
/hooks
  /useScrollAnimation.ts    → Intersection Observer scroll reveals
/scripts
  /schema.sql               → Full SQL schema reference
  /setup-db.mjs             → Database schema setup script
  /seed-data.mjs            → Seed menu items and sample orders
/public
  /images                   → Landing page photos and logo
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) OAuth 2.0 client

### 1. Clone the repository

```bash
git clone https://github.com/darcykekw/Brews-Lee.git
cd Brews-Lee
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# Supabase — Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret   # generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Google OAuth — console.cloud.google.com > Credentials
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### 4. Set up the database

Copy the contents of `scripts/schema.sql` and run it in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new).

### 5. Seed the database (optional)

```bash
# Add SUPABASE_ACCESS_TOKEN to .env.local first (supabase.com/dashboard/account/tokens)
node scripts/seed-data.mjs
```

### 6. Create Supabase Storage bucket

In the Supabase Dashboard → Storage, create a **public** bucket named `menu-images`.

### 7. Configure Google OAuth

In Google Cloud Console → Credentials → your OAuth client, add:
- **Authorized JavaScript origins:** `http://localhost:3000`
- **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`

### 8. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Access

To grant admin access to an account, run this in the Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

Then sign out and back in. The dashboard is at `/dashboard`.

---

## Current Development

### Completed
- [x] Project setup — Next.js 14, TypeScript, Tailwind CSS, custom brand color tokens
- [x] Supabase client configuration (browser, server, and admin clients)
- [x] NextAuth.js — Google OAuth + email/password login with sign-up
- [x] Full database schema — 8 tables, RLS policies, triggers, Realtime
- [x] TypeScript types for all entities
- [x] Zustand cart store with localStorage persistence
- [x] Route protection middleware (customer + admin)
- [x] Sticky navbar with scroll behavior, dark mode toggle, mobile drawer
- [x] Landing page — hero, about, craft strip, quote banner, gallery, menu preview
- [x] Auth pages — Google OAuth + email/password sign-up flow
- [x] Menu page — category tabs, search bar, item cards, customization modal
- [x] Cart drawer + cart page with quantity controls
- [x] Checkout with pickup/delivery, order notes, cash payment
- [x] Order confirmation with reference number
- [x] Order history with one-tap reorder
- [x] Real-time order tracking via Supabase Realtime
- [x] Customer profile — name update, saved addresses manager
- [x] Admin dashboard — analytics, live orders, menu manager, categories, promo banner
- [x] Image upload to Supabase Storage (menu items)
- [x] Seed data — 22 menu items across 4 categories

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXTAUTH_URL` | Your app URL (`http://localhost:3000` in dev) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
