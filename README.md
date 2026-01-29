# Dude.Box - Marketplace Platform for Makers

A multi-vendor e-commerce marketplace where craftsmen and makers can create branded storefronts, connect their payment accounts, and sell products - all on the Dude.Box platform.

**Live Site:** [www.dude.box](https://www.dude.box)  
**Stack:** Next.js 14 + NeonDB + Stripe Connect + Prisma  
**Status:** Marketplace Transformation Complete - Ready for Testing  
**Deployment:** Vercel

---

## 🎯 What is Dude.Box?

Dude.Box is an **Etsy-style marketplace** for men who make quality products but don't want to manage the tech stack. Each vendor gets:

- **Custom Subdomain:** `yourstore.dude.box`
- **Branded Storefront:** Your own product catalog and pages
- **Direct Payments:** Connect your Stripe account, receive 90% of sales
- **Email Address:** Transactional emails from `yourstore@dude.box`
- **Your Shipping:** Use your own shipping accounts and methods
- **No Tech Hassle:** We handle hosting, payments, cart, checkout

**Platform Fee:** 1% per sale (you keep 99%)

---

## 📚 Complete Documentation

### **→ [resources/MASTER_PROJECT_GUIDE.md](resources/MASTER_PROJECT_GUIDE.md) ←**

The single source of truth for the original subscription box system.

### **→ [resources/MARKETPLACE_SETUP_GUIDE.md](resources/MARKETPLACE_SETUP_GUIDE.md) ←**

Complete setup guide for marketplace features.

### **→ [resources/MARKETPLACE_TESTING_GUIDE.md](resources/MARKETPLACE_TESTING_GUIDE.md) ←**

Comprehensive testing procedures.

### **→ [resources/MARKETPLACE_MIGRATION_GUIDE.md](resources/MARKETPLACE_MIGRATION_GUIDE.md) ←**

Migration from single-vendor to marketplace.

---

## 🏗️ Architecture

```mermaid
graph TB
    Customer[Customer] --> MainSite[www.dude.box]
    Customer --> StoreA[storeA.dude.box]
    Customer --> StoreB[storeB.dude.box]
    
    MainSite --> Members[/members Dashboard]
    MainSite --> Cart[Multi-Vendor Cart]
    
    StoreA --> Products[Store Products]
    StoreB --> Products
    
    Cart --> Checkout[Sequential Checkout]
    Checkout --> StripeConnect[Stripe Connect]
    
    VendorA[Vendor A] --> VendorDash[/vendor Dashboard]
    VendorB[Vendor B] --> VendorDash
    
    VendorDash --> ManageProducts[Manage Products]
    VendorDash --> ViewOrders[View Orders]
    VendorDash --> StoreSettings[Store Settings]
    
    Admin[Admin] --> AdminDash[/admin Dashboard]
    AdminDash --> ApproveStores[Approve Stores]
    AdminDash --> Analytics[Platform Analytics]
    AdminDash --> Moderate[Moderate Products]
    
    StripeConnect --> VendorPayout[90% to Vendor]
    StripeConnect --> PlatformFee[1% Platform Fee]
    
    NeonDB[(NeonDB)] -.-> MainSite
    NeonDB -.-> VendorDash
    NeonDB -.-> AdminDash
```

---

## ✨ Features

### For Customers

- 🛒 **Multi-Vendor Shopping:** Browse products from multiple makers
- 🛍️ **Smart Cart:** Items grouped by store, clear checkout flow
- 📦 **Order Tracking:** Full order history across all stores
- 👤 **Member Dashboard:** News, announcements, order management
- 🔒 **Secure Checkout:** Stripe-powered payment processing
- 📧 **Email Notifications:** Order confirmations, shipping updates

### For Vendors

- 🏪 **Branded Storefront:** `yourstore.dude.box` subdomain
- 💳 **Direct Payments:** Connect Stripe, receive payouts in 2 days
- 📊 **Dashboard:** Manage products, orders, settings
- 📦 **Order Management:** View orders, mark as shipped
- 💰 **Transparent Fees:** Keep 90% of each sale
- 📧 **Branded Emails:** Orders sent from `yourstore@dude.box`

### For Platform Admin

- ✅ **Store Approval:** Review and approve vendor applications
- 📈 **Analytics:** GMV, platform fees, top stores
- 🛡️ **Moderation:** Flag or hide products violating policies
- 👥 **User Management:** Customers, vendors, subscriptions
- 💵 **Revenue Tracking:** Platform transaction history
- 📧 **Announcements:** Post news to member community

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router, React Server Components)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.3
- **Authentication:** NextAuth 4.24 with bcryptjs
- **State Management:** React hooks, server components

### Backend
- **Database:** NeonDB PostgreSQL (serverless, pooled connections)
- **ORM:** Prisma 5.22.0 (with 12 models)
- **Payments:** Stripe Connect (marketplace split payments)
- **Email:** Resend (transactional emails)
- **Session:** JWT via NextAuth
- **Webhooks:** Stripe event processing

### Infrastructure
- **Hosting:** Vercel (serverless, edge network)
- **Domain:** www.dude.box + wildcard subdomains
- **SSL:** Auto-provisioned by Vercel
- **CDN:** Vercel Edge Network
- **Cost:** ~$50-100/month (vs $2,300 Shopify Plus)

---

## 📦 Database Schema

**12 Models:**

1. **User** - Customers, vendors, admins
2. **Store** - Vendor storefronts
3. **Product** - Product listings (per store)
4. **Subscription** - Recurring subscriptions
5. **Order** - Purchase history
6. **OrderItem** - Line items
7. **Address** - Shipping/billing addresses
8. **Return** - Return requests and refunds
9. **Cart** - Shopping carts
10. **CartItem** - Cart line items
11. **PlatformTransaction** - Fee tracking
12. **Announcement** - Member news
13. **InvestorInquiry** - Partner inquiries (legacy)

**Key Relationships:**
- User → Stores (one-to-many)
- Store → Products (one-to-many)
- Store → Orders (one-to-many)
- Order → PlatformTransaction (one-to-one)
- Cart → CartItems (one-to-many)

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20+
- PostgreSQL database (NeonDB)
- Stripe account with Connect enabled
- Resend account (for emails)
- Vercel account (for deployment)

### Quick Start

1. **Clone and install:**
   ```bash
   git clone <repo>
   cd dude.box
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Add your database URL, Stripe keys, etc.
   ```

3. **Setup database:**
   ```bash
   npx prisma db push
   npx prisma generate
   npm run seed:dudebox-store
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Create admin account:**
   - Visit `/portal/register`
   - Login
   - Visit `/api/auth/make-admin`
   - Now access `/admin`

6. **Test vendor flow:**
   - Create second account
   - Visit `/members/become-vendor`
   - Apply for store
   - Admin approves at `/admin/stores`

### Environment Variables

See `MARKETPLACE_SETUP_GUIDE.md` for complete list.

**Critical for Marketplace:**
```env
# Stripe Connect
STRIPE_CONNECT_CLIENT_ID=ca_...
STRIPE_PLATFORM_FEE_PERCENT=1

# Application
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
```

---

## 🧪 Testing

### Run Tests

```bash
# Build check
npm run build

# Lint check
npm run lint

# Type check
npx tsc --noEmit
```

### Manual Testing

See `resources/MARKETPLACE_TESTING_GUIDE.md`

**Quick Smoke Test:**
1. Create vendor account → Apply for store
2. Admin approves store
3. Vendor adds products
4. Customer adds to cart
5. Verify cart shows items

---

## 🚀 Deployment

### Vercel Deployment

1. **Connect repository:**
   ```bash
   vercel
   ```

2. **Configure domains:**
   - Add `www.dude.box`
   - Add `*.dude.box` (wildcard for vendor stores)

3. **Set environment variables:**
   - Copy all from `.env.local`
   - Update URLs to production
   - Add Stripe Connect Client ID

4. **Deploy:**
   ```bash
   git push origin main
   ```
   Auto-deploys on push

### DNS Configuration

**Cloudflare:**
- CNAME: `*` → `cname.vercel-dns.com`
- CNAME: `www` → `cname.vercel-dns.com`

**Vercel:**
- Add domain: `*.dude.box`
- SSL auto-configured

---

## 📋 Project Status

### ✅ Completed Features

**Phase 1: Member Area**
- Member dashboard with news/announcements
- Authentication redirects to /members
- Role-based access (customer/vendor/admin)

**Phase 2: Database Schema**
- Store model for vendor storefronts
- PlatformTransaction for fee tracking
- Cart models for shopping
- Announcement model for news

**Phase 3: Stripe Connect**
- Vendor onboarding flow
- Stripe Connect OAuth integration
- Platform fee calculation
- Admin approval workflow

**Phase 4: Subdomain Routing**
- Middleware for subdomain detection
- Store pages at `storename.dude.box`
- Custom branding per store
- Product listings per store

**Phase 5: Vendor Dashboard**
- Product management (CRUD)
- Order management
- Store settings
- Sales analytics

**Phase 6: Multi-Vendor Cart**
- Cart with items from multiple stores
- Cart grouped by store
- Add to cart functionality
- Checkout flow

**Phase 7: Admin Tools**
- Store approval/rejection
- Platform analytics (GMV, fees, top stores)
- Product moderation (flag/hide)

**Phase 8: Email Notifications**
- Vendor order notifications
- Store approved/rejected emails
- Branded from `storename@dude.box`

### ⏳ Pending

**Phase 9: Testing & Polish**
- Manual testing all flows
- Security audit
- Performance optimization
- Documentation complete

**Phase 10: Production Launch**
- Stripe Connect production setup
- Wildcard DNS configuration
- Pilot vendor program
- Public announcement

---

## 📊 Marketplace Metrics

**Current Status:**
- Stores: 1 (Dude.Box default)
- Products: Migrated from original catalog
- Vendors: Open for applications
- Platform Fee: 1%

**Growth Targets:**
- Month 1: 5 vendors, $1K GMV
- Month 3: 20 vendors, $10K GMV
- Month 6: 50 vendors, $50K GMV

---

## 🔐 Security

- ✅ Stripe Connect OAuth for secure account linking
- ✅ Authorization checks (vendors can only access their data)
- ✅ Subdomain isolation (no cross-store data leaks)
- ✅ Platform fee validation
- ✅ HTTPS enforced
- ✅ Webhook signature verification
- ✅ Session encryption (NextAuth)
- ✅ Password hashing (bcryptjs)

---

## 💡 Key Concepts

### Subdomain Multi-Tenancy

Each vendor gets `storename.dude.box`:
- Middleware rewrites to `/stores/[subdomain]`
- Store-specific branding and products
- SEO-friendly URLs
- Custom navigation

### Stripe Connect

Split payments without holding funds:
- Customer pays $100
- Stripe sends $90 to vendor
- Platform keeps $10 fee
- Vendor gets payout in 2 days
- Platform never holds customer funds

### Sequential Checkout

Multi-vendor cart splits into separate orders:
- Cart groups items by store
- Each store has own checkout
- Separate orders created
- Each vendor paid independently

---

## 🛣️ Routes

### Public Routes

- `/` - Platform homepage
- `/stores/[subdomain]` - Vendor storefront
- `/stores/[subdomain]/products` - Store product catalog
- `/stores/[subdomain]/products/[id]` - Product detail
- `/stores/[subdomain]/about` - Store about page

### Member Routes (Auth Required)

- `/members` - Member dashboard (news, stats)
- `/members/news` - All announcements
- `/members/become-vendor` - Vendor application
- `/portal` - Account settings (profile, address, password)

### Vendor Routes (Vendor Role Required)

- `/vendor` - Vendor dashboard
- `/vendor/products` - Product management
- `/vendor/orders` - Order fulfillment
- `/vendor/settings` - Store configuration

### Admin Routes (Admin Role Required)

- `/admin` - Admin overview
- `/admin/stores` - Store approval
- `/admin/products` - Product moderation
- `/admin/analytics` - Platform metrics
- `/admin/announcements` - News management
- `/admin/customers` - Customer management
- `/admin/orders` - All orders
- `/admin/returns` - Return management
- `/admin/subscriptions` - Subscription tracking

### API Routes

- `/api/cart` - Cart operations
- `/api/stores/create` - Create vendor store
- `/api/stores/connect-stripe` - Stripe Connect OAuth
- `/api/vendor/*` - Vendor API endpoints
- `/api/admin/*` - Admin API endpoints
- `/api/announcements` - Announcement CRUD

---

## 🏃 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` with:

```env
# Database
DATABASE_URL="postgres://..."

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe Connect
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_CONNECT_CLIENT_ID="ca_..."
STRIPE_PLATFORM_FEE_PERCENT="1"

# Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@dude.box"

# App
NEXT_PUBLIC_APP_DOMAIN="http://localhost:3000"
```

### 3. Setup Database

```bash
npx prisma db push
npx prisma generate
npm run seed:dudebox-store
```

### 4. Create Admin Account

```bash
# Start dev server
npm run dev

# Register at http://localhost:3000/portal/register
# Then visit http://localhost:3000/api/auth/make-admin
```

### 5. Test Vendor Flow

1. Create second account
2. Visit `/members/become-vendor`
3. Fill out store application
4. Admin approves at `/admin/stores`
5. Vendor connects Stripe (if configured)
6. Vendor adds products
7. Browse at `http://storename.localhost:3000` (requires hosts file)

---

## 📖 User Guides

### For Customers

**Shopping:**
1. Browse stores at vendor subdomains
2. Add products to cart
3. Review cart (grouped by store)
4. Complete checkout for each store
5. Track orders in `/members`

**Member Benefits:**
- Dashboard with news and announcements
- Order history across all vendors
- Account management
- Returns and refunds

### For Vendors

**Getting Started:**
1. Create account at `/portal/register`
2. Apply at `/members/become-vendor`
3. Wait for admin approval (email notification)
4. Connect Stripe account
5. Add products at `/vendor/products`
6. Share your store: `yourstore.dude.box`

**Managing Your Store:**
- Add/edit products
- View orders and customer info
- Mark orders as shipped
- Update store settings and policies
- Track your sales

**Payments:**
- Stripe pays you directly (2-day payout)
- You receive 90% of each sale
- Platform keeps 1% fee
- No upfront costs

### For Admins

**Daily Tasks:**
- Review vendor applications at `/admin/stores`
- Approve/reject stores
- Check for flagged products

**Weekly Tasks:**
- Review analytics at `/admin/analytics`
- Post announcements at `/admin/announcements`
- Monitor top-performing stores

---

## 🔧 Development

### Available Scripts

```bash
npm run dev                    # Start dev server
npm run build                  # Production build
npm run start                  # Start production server
npm run lint                   # Run ESLint
npm run seed:dudebox-store     # Seed default store
```

### Database Management

```bash
npx prisma studio              # Visual database editor
npx prisma db push             # Push schema changes
npx prisma generate            # Regenerate Prisma Client
```

### Code Structure

```
src/
├── app/                       # Next.js App Router
│   ├── members/              # Member area
│   ├── vendor/               # Vendor dashboard
│   ├── stores/               # Store pages (subdomain)
│   ├── admin/                # Admin dashboard
│   ├── portal/               # Account settings
│   └── api/                  # API routes
├── components/               # React components
│   ├── admin/               # Admin-specific components
│   └── vendor/              # Vendor-specific components
└── lib/                      # Utilities
    ├── prisma.ts            # Database client
    ├── stripe.ts            # Stripe client
    ├── auth.ts              # NextAuth config
    ├── email.ts             # Email templates
    ├── marketplace.ts       # Fee calculations
    └── vendor.ts            # Vendor auth
```

---

## 🌐 Production Setup

### Prerequisites

1. **Stripe Connect:** Enable in Stripe Dashboard
2. **Wildcard DNS:** `*.dude.box` pointing to Vercel
3. **Email Domain:** Verify `dude.box` in Resend

### Deployment Steps

1. Deploy to Vercel
2. Add `*.dude.box` domain
3. Configure environment variables
4. Set up Stripe webhook endpoint
5. Test with pilot vendor
6. Open for applications

**Detailed guide:** `resources/MARKETPLACE_SETUP_GUIDE.md`

---

## 💰 Cost Breakdown

**Monthly Costs:**
- Vercel Pro: $20/month
- NeonDB: $0-25/month (based on usage)
- Resend: $0-20/month (based on emails)
- EasyPost: Pay per label ($3-5 each)
- **Total: ~$50-100/month**

**vs Shopify Plus:** $2,300/month  
**Savings:** $2,200+/month

---

## 🤝 Support

**For Vendors:**
- Email: dude@dude.box
- Dashboard: `/vendor` (after approval)
- Help docs: (coming soon)

**For Customers:**
- Email: dude@dude.box
- Member dashboard: `/members`
- Order tracking: `/portal`

**For Development:**
- Technical docs: `resources/` folder
- Issues: GitHub Issues
- Contact: alex_moore19@yahoo.com

---

## 📄 License

Proprietary - All rights reserved

---

## 🎉 Acknowledgments

Built with:
- Next.js & Vercel
- Stripe Connect
- NeonDB
- Prisma ORM
- Resend
- TailwindCSS
- NextAuth.js

---

**Version:** 6.0 (Marketplace)  
**Last Updated:** January 28, 2026  
**Status:** Core Features Complete - Testing Phase  
**Next:** Pilot Vendor Program
