# Dude.Box - Headless E-Commerce Platform

Premium EDC gear, tools, and grooming supplies from veteran-owned small businesses.

**Live Site:** [www.dude.box](https://www.dude.box)  
**Stack:** Next.js 14 + Shopify Storefront API  
**Deployment:** Vercel

---

## 🚀 Quick Start

**Ready to launch?** Follow the step-by-step action list:

### **→ [YOUR_TODO_LIST.md](YOUR_TODO_LIST.md) ←**

This consolidated guide walks you through:
1. Local setup (5 min)
2. Shopify configuration (30 min)
3. Testing (15 min)
4. Deployment to Vercel (30 min)
5. Production verification (15 min)

**Total time:** ~2 hours to go live

---

## Architecture Overview

Dude.Box is a **fully headless commerce application** where Next.js owns all UI/UX and Shopify provides product catalog, cart management, checkout, and order fulfillment.

```
┌─────────────────────────────────────────────────────────────┐
│                       www.dude.box                          │
│                    (Next.js on Vercel)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Marketing  │  │   Shop       │  │   Portal     │     │
│  │   Pages      │  │   (Products) │  │   (Account)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│                     Custom Header/Footer                    │
└────────────┬────────────────────────────────────────────────┘
             │ Storefront API
             ▼
┌─────────────────────────────────────────────────────────────┐
│                          Shopify                             │
│                    (Headless Backend)                        │
│                                                              │
│  Products  │  Cart    │  Checkout   │  Orders  │  Customers│
└─────────────────────────────────────────────────────────────┘
```

**Key Principles:**
- **Single Domain:** All customer traffic goes through www.dude.box
- **No Liquid Themes:** Shopify Online Store disabled, no theme files
- **API-First:** All data accessed via Shopify Storefront API
- **Custom UI:** Complete design control with Tailwind CSS
- **Hosted Checkout:** Shopify handles payment processing (PCI compliance included)

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
- **Authentication:** NextAuth 4.24
- **Fonts:** Inter (sans), Fraunces (serif) via Google Fonts

### Backend / Data
- **Commerce Platform:** Shopify (Storefront API 2024-07)
- **Database:** Neon PostgreSQL (via Supabase)
- **Session Storage:** JWT (NextAuth)
- **Cart Storage:** Shopify (cart ID in httpOnly cookie)

### Deployment
- **Hosting:** Vercel (automatic deployments)
- **Domain:** www.dude.box (Vercel DNS)
- **Environment:** Production + Preview environments
- **CI/CD:** Git push → Vercel auto-deploy

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
   
   Create `.env.local` file:
   ```env
   # Shopify Configuration
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
   SHOPIFY_REVALIDATION_SECRET=your_secret
   
   # NextAuth
   NEXTAUTH_SECRET=generate_random_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Database
   DATABASE_URL=your_postgres_connection_string
   
   # App Config
   NEXT_PUBLIC_APP_DOMAIN=localhost:3000
   NEXT_PUBLIC_APP_NAME=Dude.Box
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

- **Product Browsing:** Server-rendered product catalog with 5-minute cache
- **Product Search:** Filter and sort products
- **Shopping Cart:** Real-time cart managed by Shopify
- **Checkout:** Hosted by Shopify (secure, PCI-compliant)
- **Customer Accounts:** Custom login/register UI with Shopify backend
- **Order History:** View past orders in customer portal
- **Responsive Design:** Mobile-first, works on all devices

### Developer Experience

- **Type Safety:** Full TypeScript coverage
- **GraphQL Fragments:** DRY API queries
- **Server Components:** Optimal performance
- **API Routes:** Clean separation of concerns
- **Error Handling:** Graceful fallbacks
- **Caching Strategy:** Balanced freshness and performance

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

- **[YOUR_TODO_LIST.md](YOUR_TODO_LIST.md)** - Action checklist to launch your site
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flow
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Detailed Vercel deployment guide

## Support & Contact

**Technical Issues:** Open GitHub issue  
**Business Inquiries:** support@dude.box  
**General Questions:** Use GitHub Discussions

---

## License

Proprietary - All rights reserved

---

## Acknowledgments

- Shopify Storefront API
- Next.js team at Vercel
- TailwindCSS contributors
- NextAuth.js maintainers

---

**Version:** 1.0.0  
**Last Updated:** January 26, 2026  
**Status:** Production-ready ✅
