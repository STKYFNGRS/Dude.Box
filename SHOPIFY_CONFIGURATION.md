# Shopify Customer Account Configuration

## Current Issue
When users request a password reset, Shopify sends an email with a link that goes to Shopify's default customer account page instead of your custom Next.js app. This causes the `/api/auth/error` you're seeing.

## Solution: Configure Custom Customer Account Pages

### Option 1: Shopify Online Store 2.0 (Recommended)

1. **Go to Shopify Admin** → Settings → Customer accounts
2. **Enable "New customer accounts"** (if available)
3. **Set Account URL**: `https://dude.box/portal`
4. **Set Reset Password URL**: `https://dude.box/portal/reset-password`
5. **Set Register URL**: `https://dude.box/portal/register`
6. **Set Login URL**: `https://dude.box/portal/login`

### Option 2: Email Template Customization

If you can't configure custom account URLs, you can customize the email templates:

1. **Go to Shopify Admin** → Settings → Notifications
2. **Find "Customer account password reset"** template
3. **Edit the template** to use your custom URL:

```liquid
<!-- Replace the default reset button with: -->
<a href="https://dude.box/portal/reset-password?id={{ customer.id | split: '/' | last }}&token={{ customer.reset_password_url | split: '/' | last }}">
  Reset your password
</a>
```

### Option 3: Use Shopify's Classic Customer Accounts

The password reset flow will work with Shopify's hosted customer account pages, but users will have a different experience. They'll reset their password on Shopify's domain, then return to your site to login.

## Current Architecture

### User Data Storage:
- **Location**: Shopify Customer Database
- **Contains**: Email, name, password (hashed), order history
- **Access**: Via Shopify Storefront API

### Authentication Flow:
```
Registration → Shopify Customer API (creates customer)
Login → NextAuth → Shopify Authentication → Session with customer access token
Orders → Fetched via Shopify Storefront API using customer access token
```

### Password Reset Flow (After Configuration):
```
1. User enters email on /portal/forgot-password
2. App calls /api/auth/recover
3. Shopify sends email with link to /portal/reset-password?id=XXX&token=YYY
4. User enters new password
5. App calls /api/auth/reset-password
6. Shopify updates password
7. User redirected to login
```

## Verifying Your Configuration

### Test the Full Flow:
1. Create a test account at `/portal/register`
2. Request password reset at `/portal/forgot-password`
3. Check email - link should go to `dude.box/portal/reset-password`
4. Complete reset and login

### What's Working Now:
✅ User registration (creates Shopify customers)
✅ Login (authenticates against Shopify)
✅ Password recovery email (Shopify sends it)
✅ Order history (fetched from Shopify)
✅ Customer sessions (NextAuth + Shopify tokens)

### What Needs Configuration:
⚠️ Password reset URL redirect (needs Shopify admin config)
⚠️ Email template customization (optional, for branding)

## Alternative: Use Shopify Checkout for Subscriptions

If you're selling subscription boxes, consider:

1. **Recharge** - Subscription management for Shopify
2. **Bold Subscriptions** - Another popular option
3. **Shopify Subscriptions** (native, if available for your plan)

These integrate customer accounts automatically and handle recurring billing.

## Environment Variables Checklist

Make sure these are set in your `.env.local`:

```bash
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token

# NextAuth Configuration
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://dude.box

# Optional: Member Login Credentials (for admin)
MEMBER_LOGIN_EMAIL=your@email.com
MEMBER_LOGIN_PASSWORD=your_password
```

## Summary

Your user management IS properly integrated with Shopify. The only missing piece is configuring Shopify to send password reset links to your custom URL instead of Shopify's default customer account page.

**Action Required**: Update Shopify admin settings or email templates to use `https://dude.box/portal/reset-password` as the reset URL.
