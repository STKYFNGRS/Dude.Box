# Your Action List - Launch Dude.Box

**Goal:** Get www.dude.box live with headless Next.js + Shopify backend

**Estimated Time:** 2-3 hours

---

## Step 1: Local Setup (5 minutes)

- [ ] Run `npm install` to clean up dependencies
- [ ] Run `npm run dev` to verify site works locally
- [ ] Visit http://localhost:3000 and verify:
  - Homepage loads
  - Can browse to /shop
  - Can view a product page
  - No console errors

---

## Step 2: Shopify Configuration (30 minutes)

### A. Checkout Settings

1. Go to **Shopify Admin → Settings → Checkout and accounts**

- [ ] **Order status page:** Add return URL if possible (plan-dependent):
  - Try: `https://www.dude.box/thank-you`
  - If not available on your plan, that's OK - Shopify order status page works fine

### B. Customer Account Settings

1. Go to **Shopify Admin → Settings → Customer accounts**

- [ ] **Account type:** Ensure "New customer accounts" is selected (NOT "Classic")
- [ ] **Account login:** Set to "Optional" (allows guest checkout)
- [ ] **Custom URLs** (if available):
  - Password reset URL: `https://www.dude.box/portal/reset-password`
  - Account page URL: `https://www.dude.box/portal`

### C. Domain Configuration

1. Go to **Shopify Admin → Settings → Domains**

**Current setup should be:**
- [ ] `geuyxr-wz.myshopify.com` - Keep this (for admin)
- [ ] `checkout.dude.box` - Add if you want checkout on your domain (optional)

**To add checkout.dude.box (optional):**
1. In Shopify: Click "Connect existing domain" → Enter `checkout.dude.box`
2. In your DNS provider (Vercel/Cloudflare): Add CNAME record:
   - Name: `checkout`
   - Value: `shops.myshopify.com`
   - TTL: Auto or 3600
3. Wait 5-30 minutes for DNS propagation
4. Verify: Shopify shows "Connected" with SSL certificate

**If you skip checkout.dude.box:**
- Checkout will use `geuyxr-wz.myshopify.com` domain
- This is perfectly fine - customers trust Shopify checkout
- Simpler setup, one less thing to configure

### D. Storefront API Permissions

1. Go to **Shopify Admin → Settings → Apps and sales channels → Develop apps**
2. Find your Storefront API app

- [ ] Verify these permissions are enabled:
  - `unauthenticated_read_product_listings`
  - `unauthenticated_read_product_inventory`
  - `unauthenticated_write_checkouts`
  - `unauthenticated_read_checkouts`
  - `unauthenticated_write_customers`

### E. Sales Channels

1. Go to **Sales channels** in left sidebar

- [ ] **Online Store:** Keep enabled for now (for product previews in admin)
- [ ] Don't publish any theme to Online Store
- [ ] Verify no theme is live (or only a "Coming Soon" page)

### F. Email Templates (Optional but Recommended)

1. Go to **Settings → Notifications**
2. Review these templates:
   - Order confirmation
   - Shipping confirmation  
   - Password reset

- [ ] Add your branding (logo, colors)
- [ ] Verify links go to www.dude.box (not myshopify.com)

---

## Step 3: Quick Test (15 minutes)

**Test locally before deploying:**

### Product Browsing
- [ ] Go to http://localhost:3000/shop
- [ ] Products display with images and prices
- [ ] Click a product → detail page loads

### Cart Operations
- [ ] Add product to cart
- [ ] Cart badge updates in header
- [ ] Open cart drawer (click cart icon)
- [ ] Can change quantity
- [ ] Can remove items

### Checkout
- [ ] Click "Checkout" in cart drawer
- [ ] Should redirect to Shopify checkout
- [ ] Use **test mode** (don't complete real order yet)
- [ ] In Shopify: Settings → Payments → Enable test mode
- [ ] Test card: `4242 4242 4242 4242`
- [ ] Complete test order
- [ ] Verify redirect after payment

### Customer Account
- [ ] Go to http://localhost:3000/portal/register
- [ ] Create test account
- [ ] Should redirect to /portal after registration
- [ ] Verify profile displays
- [ ] Try logging out and back in

**If any tests fail:** Check browser console for errors and verify environment variables.

---

## Step 4: Deploy to Vercel (30 minutes)

### A. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select `dude-box` repository
5. Vercel auto-detects Next.js settings
6. **Don't deploy yet** - need to add environment variables first

### B. Add Environment Variables

In Vercel project settings → Environment Variables, add:

**Required:**
- [ ] `SHOPIFY_STORE_DOMAIN` = `geuyxr-wz.myshopify.com`
- [ ] `SHOPIFY_STOREFRONT_ACCESS_TOKEN` = (from .env)
- [ ] `NEXTAUTH_SECRET` = (from .env - or generate new: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` = `https://www.dude.box`

**Optional but Recommended:**
- [ ] `DATABASE_URL` = (from .env)
- [ ] `SHOPIFY_REVALIDATION_SECRET` = (from .env)
- [ ] `NEXT_PUBLIC_APP_DOMAIN` = `www.dude.box`
- [ ] `NEXT_PUBLIC_APP_NAME` = `Dude.Box`

**Important:** 
- Set environment for: Production ✓, Preview ✓
- Don't include quotes around values

### C. Deploy

- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Build should succeed with green checkmark

### D. Configure Domain

1. In Vercel → Project Settings → Domains

- [ ] Add domain: `www.dude.box`
- [ ] Vercel provides DNS instructions

**DNS Configuration (at your registrar):**

**Option A: Use Vercel Nameservers (Easiest)**
- Update nameservers to: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`

**Option B: A Record + CNAME**
- A Record: `@` → `76.76.21.21`
- CNAME: `www` → `cname.vercel-dns.com`

- [ ] Wait for DNS propagation (5 minutes - 2 hours)
- [ ] Verify: https://www.dude.box loads
- [ ] Verify: SSL certificate is active (padlock icon)

---

## Step 5: Production Verification (15 minutes)

### Smoke Test on Production

Visit **https://www.dude.box** and test:

- [ ] Homepage loads correctly
- [ ] Shop page shows products
- [ ] Can view product detail page
- [ ] Can add to cart
- [ ] Cart drawer opens and shows items
- [ ] No JavaScript errors in console (F12 → Console)

### Test Checkout Flow (IMPORTANT)

**Before real customers:**

1. **Disable Shopify test mode:**
   - Shopify Admin → Settings → Payments
   - Turn off test mode
   - Verify real payment gateway is active

2. **Do a real test order** (with real payment):
   - [ ] Add cheap item to cart
   - [ ] Click checkout
   - [ ] Complete purchase with real card (charge yourself $1-5)
   - [ ] Verify payment goes through
   - [ ] Verify order appears in Shopify admin
   - [ ] Verify confirmation email received
   - [ ] Verify redirect after checkout works

**If test order fails:** Check payment gateway configuration in Shopify.

### Test Customer Account

- [ ] Register new account at www.dude.box/portal/register
- [ ] Verify account created in Shopify admin
- [ ] Log in at www.dude.box/portal/login
- [ ] Verify dashboard loads
- [ ] Check if test order appears in order history

---

## Step 6: Monitor (First 24 Hours)

After launch:

- [ ] Check Vercel logs for any errors (Vercel dashboard → Logs)
- [ ] Monitor first few real orders in Shopify
- [ ] Check email notifications are sending
- [ ] Test on mobile device (your phone)
- [ ] Ask a friend to test and provide feedback

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Products not loading | Check SHOPIFY_STOREFRONT_ACCESS_TOKEN in Vercel |
| Can't log in | Check NEXTAUTH_SECRET and NEXTAUTH_URL |
| Checkout fails | Verify payment gateway in Shopify (test mode off) |
| Slow page loads | Check Vercel analytics, may need caching tweaks |

---

## Optional Enhancements (After Launch)

**Only do these if you have time and need them:**

- [ ] Set up Google Analytics (add tracking code to layout.tsx)
- [ ] Configure Shopify webhooks for automatic product updates
- [ ] Customize email templates with better branding
- [ ] Add more products to shop
- [ ] Create blog or additional content pages
- [ ] Set up abandoned cart recovery (Shopify feature)

---

## Cleanup (After 30 Days)

Once everything is working smoothly:

- [ ] Delete `backup-liquid-theme-2026-01-26/` directory
- [ ] Delete this file (YOUR_TODO_LIST.md) - you're done!
- [ ] Celebrate - your headless store is live! 🎉

---

## Need Help?

**Resources:**
- `README.md` - Project overview and tech stack
- `ARCHITECTURE.md` - How the system works
- `DEPLOYMENT_GUIDE.md` - Detailed deployment reference

**Stuck?** Check:
1. Browser console (F12) for JavaScript errors
2. Vercel logs for server errors
3. Shopify API status page
4. Environment variables are set correctly

---

**Last Updated:** January 26, 2026  
**Version:** 1.0
