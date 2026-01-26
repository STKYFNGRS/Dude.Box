# Deployment Guide - Dude.Box

Complete guide for deploying the Dude.Box headless e-commerce application to production.

**Target Platform:** Vercel  
**Domain:** www.dude.box  
**Backend:** Shopify (Headless)

---

## Pre-Deployment Checklist

### Code Preparation
- [ ] All changes committed to git
- [ ] No console.log statements in production code
- [ ] .env.local excluded from git (.gitignore configured)
- [ ] README.md up to date
- [ ] package.json dependencies clean (no unused packages)

### Shopify Configuration
- [ ] Storefront API token created
- [ ] Required API permissions enabled
- [ ] Customer account settings configured
- [ ] Checkout branding configured
- [ ] Return URLs set to production domain
- [ ] Email templates customized
- [ ] Payment gateway configured and tested
- [ ] Test mode disabled (for production)

### Environment Variables
- [ ] All required variables documented
- [ ] Production values prepared (not test/dev values)
- [ ] NEXTAUTH_SECRET generated (strong random string)
- [ ] Database connection string ready
- [ ] No hardcoded secrets in code

---

## Vercel Deployment Steps

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account (recommended)
3. Grant Vercel access to your repositories

### Step 2: Import Project

1. Click "Add New" → "Project"
2. Select repository: `dude-box`
3. Vercel auto-detects Next.js configuration

**Configure Project:**
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `.` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (default)

Click "Deploy" (will fail without environment variables - that's OK)

### Step 3: Configure Environment Variables

1. Go to Project Settings → Environment Variables
2. Add the following variables:

#### Required Variables

```env
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
SHOPIFY_REVALIDATION_SECRET=your_webhook_secret_here

# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://www.dude.box

# Database
DATABASE_URL=postgresql://...your_connection_string

# App Configuration
NEXT_PUBLIC_APP_DOMAIN=www.dude.box
NEXT_PUBLIC_APP_NAME=Dude.Box
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Environment Scope:**
- Production: ✅ Check
- Preview: ✅ Check (optional, for PR previews)
- Development: ❌ Uncheck (use .env.local locally)

3. Save all variables
4. Trigger redeploy: Deployments → ⋯ → Redeploy

### Step 4: Configure Custom Domain

1. Go to Project Settings → Domains
2. Add domain: `www.dude.box`
3. Vercel provides DNS configuration instructions

**DNS Configuration (at your domain registrar):**

**Option A: Vercel Nameservers (Recommended)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```
Update your domain's nameservers to Vercel's.

**Option B: A Record + CNAME**
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel's IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (5 minutes - 48 hours)
5. Vercel auto-provisions SSL certificate (Let's Encrypt)

**Verification:**
- [ ] `https://www.dude.box` loads correctly
- [ ] `http://www.dude.box` redirects to HTTPS
- [ ] `dude.box` redirects to `www.dude.box` (configure if needed)
- [ ] SSL certificate valid (padlock icon in browser)

### Step 5: Configure Domain Redirect (Optional)

If you want `dude.box` (without www) to redirect to `www.dude.box`:

1. Project Settings → Domains
2. Add domain: `dude.box`
3. Configure as redirect to `www.dude.box`

### Step 6: Verify Deployment

**Automated Checks (Vercel Dashboard):**
- [ ] Build succeeded (green checkmark)
- [ ] No build errors
- [ ] Deployment status: Ready

**Manual Checks:**
1. Visit https://www.dude.box
2. **Test Homepage:**
   - [ ] Loads without errors
   - [ ] Images display
   - [ ] Navigation works
   - [ ] Footer displays

3. **Test Product Pages:**
   - [ ] /shop loads products
   - [ ] Product detail pages work
   - [ ] Images load
   - [ ] "Add to Cart" button works

4. **Test Cart:**
   - [ ] Can add items
   - [ ] Cart drawer opens
   - [ ] Quantities update
   - [ ] Cart persists on refresh

5. **Test Checkout:**
   - [ ] "Checkout" redirects to Shopify
   - [ ] Products appear correctly
   - [ ] Can complete test order (use test mode)
   - [ ] Redirects to thank you page

6. **Test Customer Account:**
   - [ ] /portal/register creates account
   - [ ] /portal/login works
   - [ ] Order history displays
   - [ ] Profile editing saves

**Check Console (Browser DevTools):**
- [ ] No JavaScript errors
- [ ] No failed API requests
- [ ] No 404s for assets

**Check Vercel Logs:**
- Project → Logs
- [ ] No server errors
- [ ] API routes responding correctly

---

## Post-Deployment Configuration

### Step 1: Update Shopify Settings

Now that your production site is live, update Shopify to point to it:

1. **Shopify Admin → Settings → Domains**
   - Primary domain: www.dude.box (if using custom checkout domain)
   
2. **Shopify Admin → Settings → Checkout**
   - Order status page URL: `https://www.dude.box/thank-you`
   
3. **Shopify Admin → Settings → Customer accounts**
   - Password reset URL: `https://www.dude.box/portal/reset-password`
   - Account page URL: `https://www.dude.box/portal`

4. **Shopify Admin → Settings → Notifications**
   - Review email templates
   - Verify all links point to www.dude.box (not myshopify.com)

### Step 2: Disable Shopify Test Mode

1. **Shopify Admin → Settings → Payments**
2. Disable test mode
3. Verify live payment gateway is active
4. Test with real (low-value) transaction

### Step 3: Configure Analytics

**Vercel Analytics (Built-in):**
- Already enabled by default
- View in Vercel Dashboard → Analytics
- Tracks Core Web Vitals, page views

**Additional Analytics (Optional):**

Add Google Analytics:
1. Create GA4 property
2. Add tracking code to `src/app/layout.tsx`:

```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Step 4: Configure Webhooks (Optional)

For automatic product updates (ISR):

1. **Shopify Admin → Settings → Notifications → Webhooks**
2. Create webhook:
   - Event: `products/update`
   - URL: `https://www.dude.box/api/revalidate`
   - Format: JSON

3. Create revalidate API route:

```typescript
// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const secret = request.headers.get('x-shopify-hmac-sha256');
  
  // Verify webhook signature (important for security)
  if (secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const productHandle = body.handle;
  
  if (productHandle) {
    revalidatePath('/shop');
    revalidatePath(`/products/${productHandle}`);
  }
  
  return NextResponse.json({ revalidated: true });
}
```

### Step 5: Set Up Monitoring

**Vercel Monitoring (Built-in):**
- Error tracking
- Performance monitoring
- Log streaming

**Optional External Monitoring:**
- Sentry for error tracking
- LogRocket for session replay
- Datadog for infrastructure monitoring

---

## Continuous Deployment

### Automatic Deployments

**Main Branch → Production:**
```bash
git add .
git commit -m "feat: new feature"
git push origin main
```
Vercel automatically deploys to production.

**Preview Deployments:**
- Every pull request gets unique preview URL
- Test changes before merging
- Share with team for review

### Deployment Workflow

```
1. Create feature branch
   git checkout -b feature/new-feature

2. Make changes and commit
   git add .
   git commit -m "feat: add new feature"

3. Push to GitHub
   git push origin feature/new-feature

4. Create Pull Request
   GitHub → Pull Requests → New PR

5. Vercel creates preview deployment
   Preview URL available in PR comments

6. Review and test preview

7. Merge PR
   GitHub → Merge pull request

8. Vercel deploys to production
   Automatic deployment to www.dude.box
```

### Rollback Strategy

If deployment has issues:

**Option 1: Instant Rollback (Vercel Dashboard)**
1. Go to Deployments
2. Find previous working deployment
3. Click ⋯ → Promote to Production
4. Previous version is live instantly

**Option 2: Git Revert**
```bash
git revert HEAD
git push origin main
```
Vercel auto-deploys the revert.

**Option 3: Redeploy Specific Commit**
1. Vercel Dashboard → Deployments
2. Find working commit
3. Click Redeploy

---

## Environment-Specific Configurations

### Production
- `NEXTAUTH_URL=https://www.dude.box`
- Analytics enabled
- Shopify test mode disabled
- Error reporting enabled
- Performance monitoring active

### Preview (PR Deployments)
- `NEXTAUTH_URL=https://[unique-url].vercel.app`
- Analytics optional
- Shopify test mode enabled
- Same database as production (or separate)

### Development (Local)
- `NEXTAUTH_URL=http://localhost:3000`
- No analytics
- Shopify test mode enabled
- Local environment variables (.env.local)

---

## Performance Optimization

### Vercel Configuration

**next.config.js:**
```javascript
module.exports = {
  images: {
    domains: ['cdn.shopify.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable compression
  compress: true,
  
  // Edge runtime for API routes (optional)
  experimental: {
    runtime: 'edge',
  },
};
```

### Caching Headers

Vercel automatically handles caching for:
- Static assets (images, JS, CSS) → 1 year
- HTML pages → Based on Next.js config
- API routes → No cache by default

### CDN Configuration

Vercel's Edge Network (CDN) is automatic:
- 70+ global regions
- Automatic asset optimization
- DDoS protection included

---

## Security Checklist

### Pre-Launch Security Review

- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Environment variables server-side only
- [ ] No secrets in client-side code
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Storefront API token has minimal scopes
- [ ] No Admin API token exposed
- [ ] Input validation on all forms
- [ ] CSRF protection enabled (NextAuth)
- [ ] Rate limiting considered (if high traffic)
- [ ] Security headers configured (Vercel defaults good)

### Shopify Security

- [ ] Payment gateway configured correctly
- [ ] Fraud detection enabled
- [ ] Test mode disabled for production
- [ ] Webhook signatures verified (if using webhooks)
- [ ] Customer passwords managed by Shopify (secure)

---

## Troubleshooting

### Build Fails

**Check:**
- Build logs in Vercel dashboard
- TypeScript errors: `npx tsc --noEmit`
- Missing dependencies: `npm install`
- Environment variables set correctly

### Site is Slow

**Check:**
- Vercel Analytics for bottlenecks
- Shopify API response times
- Image optimization (use Next.js Image)
- Caching configuration
- Database query performance

### Checkout Not Working

**Check:**
- Shopify test mode disabled
- Cart cookie being set
- Checkout URL valid
- Network tab for API errors
- Shopify API status page

### Customer Login Fails

**Check:**
- NEXTAUTH_SECRET configured
- NEXTAUTH_URL correct (https://www.dude.box)
- Shopify customer exists
- Customer account enabled (not disabled)
- Session cookie being set

---

## Maintenance

### Regular Tasks

**Weekly:**
- [ ] Check Vercel logs for errors
- [ ] Monitor analytics for issues
- [ ] Review Shopify order reports

**Monthly:**
- [ ] Update dependencies: `npm update`
- [ ] Review Core Web Vitals
- [ ] Check for Shopify API updates
- [ ] Review security advisories

**Quarterly:**
- [ ] Review Shopify API version (currently 2024-07)
- [ ] Consider upgrading to latest stable
- [ ] Performance audit
- [ ] SEO audit

### Updates and Upgrades

**Dependency Updates:**
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test locally
npm run build
npm run dev

# Deploy
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push origin main
```

**Next.js Version Updates:**
Follow Next.js upgrade guide. Test thoroughly before deploying.

**Shopify API Version Updates:**
Update `SHOPIFY_API_VERSION` in `src/lib/shopify.ts`. Test all API calls.

---

## Success Metrics

### Key Performance Indicators

**Technical:**
- Uptime: 99.9%+
- Page load time: <2 seconds
- Time to Interactive: <3 seconds
- Lighthouse Performance: 90+

**Business:**
- Conversion rate (visitors → orders)
- Average order value
- Cart abandonment rate
- Customer account signups

**User Experience:**
- Zero JavaScript errors in production
- <1% API error rate
- Successful checkout rate: 95%+

---

## Support Contacts

**Vercel Support:** support@vercel.com (Enterprise plan)  
**Shopify Support:** Shopify Admin → Help  
**Domain Registrar:** Check your registrar's support  
**Development Team:** Create GitHub issue

---

## Appendix: Environment Variables Reference

### Complete List

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| SHOPIFY_STORE_DOMAIN | ✅ | Your Shopify store | `your-store.myshopify.com` |
| SHOPIFY_STOREFRONT_ACCESS_TOKEN | ✅ | API authentication | `abc123...` |
| SHOPIFY_REVALIDATION_SECRET | ⚠️ | Webhook verification | `secret123` |
| NEXTAUTH_SECRET | ✅ | Session encryption | `random_32_char_string` |
| NEXTAUTH_URL | ✅ | Site URL | `https://www.dude.box` |
| DATABASE_URL | ⚠️ | Postgres connection | `postgresql://...` |
| NEXT_PUBLIC_APP_DOMAIN | ⚠️ | Public site domain | `www.dude.box` |
| NEXT_PUBLIC_APP_NAME | ⚠️ | Site name | `Dude.Box` |

✅ = Required  
⚠️ = Optional or feature-specific

---

**Deployment Checklist Completed:** ___________  
**Deployed By:** ___________  
**Deployment Date:** ___________  
**Production URL:** https://www.dude.box
