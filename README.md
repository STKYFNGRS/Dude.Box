# Dude.Box - Custom E-Commerce Platform

Premium subscription box of veteran-made EDC gear delivered monthly.

**Live Site:** [www.dude.box](https://www.dude.box)  
**Stack:** Next.js 14 + NeonDB + Stripe + Prisma  
**Status:** 85% Complete - Production Ready  
**Deployment:** Vercel

---

## 📚 COMPLETE DOCUMENTATION

### **→ [resources/MASTER_PROJECT_GUIDE.md](resources/MASTER_PROJECT_GUIDE.md) ←**

**This is the single source of truth for the entire project.**

Contains:
- ✅ Complete project status and progress (85% done)
- ✅ All 8 completed phases detailed
- ✅ Database schema and architecture
- ✅ Environment setup guide for production
- ✅ Troubleshooting guide for common issues
- ✅ Testing checklists
- ✅ Migration scripts documentation
- ✅ Stripe integration details
- ✅ Returns & refunds system guide

**Quick Reference Guides:**
- [resources/VERCEL_ENV_SETUP.md](resources/VERCEL_ENV_SETUP.md) - Production deployment variables
- [resources/QUICK_FIX_GUIDE.txt](resources/QUICK_FIX_GUIDE.txt) - Emergency fixes

---

## 🎯 Current Status

**Phase 8 Complete (95%)** - Returns & Refunds Management System Live  
**Next:** Phase 9 - Testing & Polish

### What's Working:
- ✅ Custom authentication (no Shopify dependencies)
- ✅ NeonDB PostgreSQL database with 8 tables
- ✅ Stripe subscriptions with checkout flow
- ✅ Customer portal (subscriptions, orders, returns)
- ✅ Admin dashboard (subscriptions, orders, customers, returns)
- ✅ Complete returns system with shipping labels
- ✅ Automated emails (orders, subscriptions, returns, refunds)
- ✅ Bidirectional Stripe sync
- ✅ Production deployment on Vercel

### Migration from Shopify:
- ✅ Removed all Shopify dependencies
- ✅ Custom payment processing via Stripe
- ✅ Database-driven product catalog
- ✅ Cost reduced from $2,300/month (Shopify Plus) to ~$30/month

---

## Architecture Overview

Dude.Box is a **custom subscription platform** with Next.js frontend, PostgreSQL database, and Stripe payment processing.

```
┌─────────────────────────────────────────────────────────────┐
│                       www.dude.box                          │
│                    (Next.js on Vercel)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Homepage   │  │   Products   │  │   Portal     │     │
│  │              │  │   Checkout   │  │   (Customer) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐                                           │
│  │   Admin      │  (Subscriptions, Orders, Returns)        │
│  │   Dashboard  │                                           │
│  └──────────────┘                                           │
└────┬──────────────────────┬──────────────────┬─────────────┘
     │                      │                  │
     ▼                      ▼                  ▼
┌─────────┐         ┌──────────────┐    ┌─────────────┐
│ NeonDB  │         │    Stripe    │    │   Resend    │
│  (Data) │         │  (Payments)  │    │   (Email)   │
└─────────┘         └──────────────┘    └─────────────┘
```

**Key Features:**
- **Full Control:** Own your data, code, and customer experience
- **Database-Driven:** PostgreSQL via NeonDB (Prisma ORM)
- **Stripe Integration:** Subscriptions, checkout, webhooks, refunds
- **Returns System:** Complete workflow with automatic shipping labels
- **Admin Dashboard:** Manage subscriptions, orders, customers, returns
- **No Shopify:** Zero dependencies on external platforms

---

## Project Structure

```
dude.box/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout with header/footer
│   │   ├── page.tsx                 # Homepage
│   │   ├── shop/                    # Product listing
│   │   ├── products/[handle]/       # Product detail pages
│   │   ├── portal/                  # Customer account
│   │   ├── thank-you/               # Post-checkout page
│   │   └── api/                     # API routes
│   │       ├── cart/                # Cart operations
│   │       ├── auth/                # NextAuth
│   │       └── customer/            # Profile/address updates
│   │
│   ├── components/                  # React components
│   │   ├── SiteHeader.tsx           # Global nav with cart
│   │   ├── SiteFooter.tsx           # Global footer
│   │   ├── CartDrawer.tsx           # Slide-out cart
│   │   ├── ProductPurchaseOptions   # Add to cart + variants
│   │   └── ...
│   │
│   └── lib/                         # Core utilities
│       ├── shopify.ts               # Storefront API client
│       ├── auth.ts                  # NextAuth config
│       └── cart.ts                  # Cart utilities
│
├── public/                          # Static assets
│   └── Logo.png                     # Brand logo
│
├── backup-liquid-theme-2026-01-26/  # Archived Shopify theme files
│
├── .env                             # Environment variables
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
│
└── Documentation/
    ├── YOUR_TODO_LIST.md            # Start here: Action checklist
    ├── README.md                    # This file: Project overview
    ├── ARCHITECTURE.md              # How the system works
    └── DEPLOYMENT_GUIDE.md          # Detailed deployment reference
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router, React Server Components)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.3
- **Authentication:** NextAuth 4.24 with bcryptjs
- **UI:** Custom components (no external UI library)

### Backend / Data
- **Database:** NeonDB PostgreSQL (serverless)
- **ORM:** Prisma 5.22.0
- **Payments:** Stripe (subscriptions, checkout, webhooks, refunds)
- **Email:** Resend (order confirmations, return notifications)
- **Shipping:** EasyPost (return label generation)
- **Session:** JWT via NextAuth

### Deployment
- **Hosting:** Vercel (automatic deployments)
- **Domain:** www.dude.box
- **Database:** NeonDB (serverless PostgreSQL)
- **CI/CD:** Git push → Vercel auto-deploy
- **Cost:** ~$30/month (vs $2,300/month Shopify Plus)

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Shopify store with Storefront API access
- Vercel account (for deployment)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/dude-box.git
   cd dude-box
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Copy the `.env` file or create `.env.local`:
   ```env
   # Database (NeonDB)
   DATABASE_URL=your_neondb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # Stripe (use test keys for development)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_... # From stripe listen
   
   # Resend Email
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=noreply@dude.box
   SUPPORT_EMAIL=dude@dude.box
   
   # EasyPost (optional - for return labels)
   EASYPOST_API_KEY=EZTEST_...
   RETURN_ADDRESS_NAME=Dude.Box Returns
   RETURN_ADDRESS_STREET1=Your Address
   RETURN_ADDRESS_CITY=Your City
   RETURN_ADDRESS_STATE=CA
   RETURN_ADDRESS_ZIP=12345
   RETURN_ADDRESS_COUNTRY=US
   
   # App Config
   NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=Dude.Box
   ```

4. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Start Stripe webhook listener (separate terminal):**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

7. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

**See [resources/MASTER_PROJECT_GUIDE.md](resources/MASTER_PROJECT_GUIDE.md) for complete setup instructions.**

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

### Required

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `SHOPIFY_STORE_DOMAIN` | Your Shopify store domain | Shopify Admin → Settings → Domains |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API token | Shopify Admin → Apps → Develop apps |
| `NEXTAUTH_SECRET` | Session encryption key | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Site URL | `https://www.dude.box` in production |

### Optional

| Variable | Description |
|----------|-------------|
| `SHOPIFY_REVALIDATION_SECRET` | Webhook verification secret |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_NAME` | Site name for metadata |

---

## Key Features

### Customer Experience

- **Subscription Checkout:** Stripe-powered secure payment processing
- **Customer Portal:** View and manage subscriptions, orders, and returns
- **Order History:** Complete order tracking with status updates
- **Returns System:** Request returns, receive shipping labels, track refunds
- **Address Management:** Update shipping and billing addresses
- **Profile Management:** Update account information
- **Email Notifications:** Order confirmations, subscription updates, return status

### Admin Experience

- **Dashboard:** MRR, customer count, subscription metrics
- **Subscription Management:** View all subscriptions, track cancellations
- **Order Management:** Complete order history with fulfillment tracking
- **Customer Management:** View all customers with subscription status
- **Returns Dashboard:** Approve/reject returns, generate labels, issue refunds
- **Refund Processing:** Full or partial refunds via Stripe API

### Developer Experience

- **Type Safety:** Full TypeScript with Prisma types
- **Database ORM:** Prisma 5 with migrations
- **Server Components:** Optimal performance with React Server Components
- **API Routes:** Clean REST endpoints for all operations
- **Webhook Handling:** Automated Stripe event processing
- **Email Templates:** Beautiful HTML emails with dark theme

---

## Shopify Configuration

### Required Shopify Settings

**Storefront API Permissions:**
- `unauthenticated_read_product_listings` - Product catalog
- `unauthenticated_read_product_inventory` - Stock levels
- `unauthenticated_write_checkouts` - Create checkouts
- `unauthenticated_write_customers` - Customer registration

**Customer Accounts:**
- Type: "New customer accounts" (not Classic)
- Login: Optional (allows guest checkout)
- Password reset URL: `https://www.dude.box/portal/reset-password`

**Checkout:**
- Return URL: `https://www.dude.box/thank-you`
- Branding configured to match www.dude.box

**Sales Channels:**
- Online Store: Disabled (headless only)

See `PHASE2_SHOPIFY_CONFIGURATION_GUIDE.md` for detailed setup.

---

## API Reference

### Storefront API Queries

#### Get Products List
```graphql
query Products {
  products(first: 8, sortKey: UPDATED_AT, reverse: true) {
    nodes {
      ...ProductBasic
    }
  }
}
```

#### Get Product by Handle
```graphql
query ProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    ...ProductBasic
  }
}
```

#### Get Cart
```graphql
query GetCart($cartId: ID!) {
  cart(id: $cartId) {
    ...CartDetails
  }
}
```

See `src/lib/shopify.ts` for complete API implementation.

---

## Deployment

### Vercel Deployment (Recommended)

1. **Connect repository to Vercel:**
   - Import project from GitHub
   - Vercel auto-detects Next.js

2. **Configure environment variables:**
   - Add all required env vars in Vercel dashboard
   - Settings → Environment Variables

3. **Deploy:**
   ```bash
   git push origin main
   ```
   Vercel auto-deploys on push

4. **Configure domain:**
   - Settings → Domains
   - Add `www.dude.box`
   - Update DNS records

### Environment-Specific Configs

**Production:**
- `NEXTAUTH_URL=https://www.dude.box`
- All Shopify URLs point to production store
- Analytics enabled

**Preview:**
- Automatic preview deployments for PRs
- Unique URL per deployment
- Uses production Shopify store (test mode)

---

## Development Workflow

### Local Development

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build production
npm run build
```

### Code Organization

**Server Components:** Use for data fetching, SEO  
**Client Components:** Use for interactivity, state  
**API Routes:** Use for Shopify API proxy, webhooks  
**Lib/Utils:** Shared logic, type definitions

### Caching Strategy

| Resource | Strategy | Revalidate |
|----------|----------|------------|
| Product List | ISR | 5 minutes |
| Product Detail | SSR | On request |
| Cart | No cache | Real-time |
| Customer Data | No cache | Real-time |

---

## Testing

### Manual Testing Checklist

**Product Browsing:**
- [ ] Products load at /shop
- [ ] Product detail pages load
- [ ] Images display correctly
- [ ] Prices display correctly

**Cart Operations:**
- [ ] Add to cart works
- [ ] Update quantity works
- [ ] Remove items works
- [ ] Cart persists across sessions

**Checkout:**
- [ ] Guest checkout works
- [ ] Logged-in checkout pre-fills email
- [ ] Payment processing works (test mode)
- [ ] Redirects to thank you page

**Customer Accounts:**
- [ ] Registration creates Shopify customer
- [ ] Login works
- [ ] Order history displays
- [ ] Profile editing saves

### End-to-End Test Flow

1. Browse products as guest
2. Add items to cart
3. Register new account
4. Complete checkout
5. Verify order in portal
6. Test password reset
7. Edit profile information

---

## Common Issues & Solutions

### Issue: Products not loading

**Check:**
- Storefront API token valid
- SHOPIFY_STORE_DOMAIN correct
- Products published in Shopify
- Network tab for API errors

### Issue: Cart not persisting

**Check:**
- Cookies enabled in browser
- `dudebox_cart` cookie set
- Cart API route working
- Shopify cart not expired (10-day limit)

### Issue: Checkout redirect fails

**Check:**
- Cart has items
- Cart ID valid
- Shopify checkout accessible
- Network connectivity

### Issue: Customer can't log in

**Check:**
- Shopify customer exists
- Password correct
- Customer account enabled (not disabled in Shopify)
- NEXTAUTH_SECRET configured

---

## Performance

### Lighthouse Scores (Target)

- **Performance:** 90+
- **Accessibility:** 100
- **Best Practices:** 95+
- **SEO:** 100

### Optimization Techniques

- Server-side rendering for initial load
- Image optimization with Next.js Image
- Code splitting (automatic)
- Font optimization (Google Fonts with display=swap)
- CSS purging (Tailwind)

### Monitoring

- Vercel Analytics (built-in)
- Core Web Vitals tracking
- Error logging (Vercel dashboard)

---

## Security

### Best Practices Implemented

- ✅ HTTPS enforced (Vercel)
- ✅ Environment variables server-side only
- ✅ httpOnly cookies for cart ID
- ✅ JWT session encryption
- ✅ Storefront API token scoped (no admin access)
- ✅ Input validation on forms
- ✅ NextAuth CSRF protection

### What Shopify Handles

- PCI compliance (checkout/payments)
- Credit card processing
- Fraud detection
- SSL certificates
- Customer password hashing

---

## Contributing

### Development Guidelines

1. **Branch Strategy:**
   - `main` → production
   - `develop` → staging
   - Feature branches → `feature/name`

2. **Commit Convention:**
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation
   - `refactor:` Code refactoring
   - `test:` Tests

3. **Pull Request Process:**
   - Create feature branch
   - Make changes
   - Test locally
   - Submit PR to `develop`
   - Code review
   - Merge after approval

---

## Documentation

**Primary Documentation:**
- **[resources/MASTER_PROJECT_GUIDE.md](resources/MASTER_PROJECT_GUIDE.md)** - Complete project guide (single source of truth)

**Quick References:**
- **[resources/VERCEL_ENV_SETUP.md](resources/VERCEL_ENV_SETUP.md)** - Production environment variables
- **[resources/QUICK_FIX_GUIDE.txt](resources/QUICK_FIX_GUIDE.txt)** - Emergency troubleshooting

**Archived Documentation:**
- **[resources/archive/](resources/archive/)** - Historical implementation documents

---

## Migration Scripts

### Link Orders to Addresses
```bash
npm run migrate:link-addresses
```
Links existing orders to user shipping addresses (required for return label generation).

---

## Support & Contact

**Technical Issues:** Open GitHub issue  
**Business Owner:** Alex Moore  
**Support Email:** dude@dude.box

---

## License

Proprietary - All rights reserved

---

## Acknowledgments

- Next.js team at Vercel
- Stripe payment processing
- NeonDB serverless PostgreSQL
- Prisma ORM
- Resend email service
- EasyPost shipping API
- TailwindCSS
- NextAuth.js

---

**Version:** 5.0  
**Last Updated:** January 28, 2026  
**Status:** 85% Complete - Phase 8 Functional ✅  
**Next:** Phase 9 - Testing & Polish
