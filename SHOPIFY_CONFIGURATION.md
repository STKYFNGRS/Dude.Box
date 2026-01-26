# Shopify Admin Configuration Guide

**Last Updated:** 2026-01-26  
**Store:** dudedotbox.myshopify.com  
**Custom Domain:** www.dude.box

This guide provides step-by-step instructions for configuring your Shopify admin settings to work properly with the headless Next.js frontend at www.dude.box.

---

## Overview

Your headless setup requires specific Shopify Admin configurations to ensure:
1. Checkout uses your custom domain (or properly redirects back)
2. Customer account links point to your custom site
3. Users don't get stuck on myshopify.com domains

---

## Configuration Checklist

### 1. Configure Checkout Domain

**Location:** Shopify Admin → Settings → Domains

**Current Setup:**
- Primary domain: `dudedotbox.myshopify.com`

**Two Options:**

#### Option A: Custom Checkout Domain (Recommended for Branding)

Add `checkout.dude.box` as a custom checkout domain:

1. In Shopify Admin:
   - Go to Settings → Domains
   - Click "Connect existing domain"
   - Enter: `checkout.dude.box`
   - Follow Shopify's verification instructions

2. In your DNS provider (Vercel/Cloudflare/etc.):
   - Add CNAME record:
     - **Name:** `checkout`
     - **Value:** `shops.myshopify.com`
     - **TTL:** Auto or 3600

3. Wait 5-30 minutes for DNS propagation

4. Verify in Shopify:
   - Domain shows "Connected" status
   - SSL certificate is active

**Benefits:**
- Checkout uses your branded domain
- Better brand consistency
- Professional appearance

**Note:** Requires DNS configuration and may take time to propagate.

---

#### Option B: Keep myshopify.com for Checkout (Simpler)

Keep using `dudedotbox.myshopify.com` for checkout:

**Benefits:**
- No DNS configuration needed
- Customers trust Shopify checkout domain
- Immediate setup
- Simpler maintenance

**Note:** Checkout will use `dudedotbox.myshopify.com` but will still redirect back to www.dude.box after completion.

---

### 2. Configure Order Status Page URL

**Location:** Shopify Admin → Settings → Checkout → Order processing

**Setting:** Order status page

**Value to Set:**
```
https://www.dude.box/thank-you
```

**What This Does:**
- After completing checkout, customers are redirected to your custom thank-you page
- Prevents customers from staying on Shopify's default order status page
- Maintains consistent branding throughout the entire purchase flow

**Steps:**
1. Go to Shopify Admin → Settings → Checkout
2. Scroll to "Order processing" section
3. Find "Order status page" setting
4. Enter: `https://www.dude.box/thank-you`
5. Click "Save"

---

### 3. Configure Customer Account URLs

**Location:** Shopify Admin → Settings → Customer accounts

#### Account Type Settings

**Setting:** New customer accounts (preferred)
- Ensure "New customer accounts" is selected (NOT "Classic")
- This provides better API integration with your headless frontend

**Setting:** Account requirement
- Set to "Optional" to allow guest checkout
- Or "Required" if you want to require accounts

#### Custom Account URLs

Configure these URLs to point to your custom domain:

**Account page URL:**
```
https://www.dude.box/portal
```

**Password reset URL:**
```
https://www.dude.box/portal/reset-password
```

**What These Do:**
- Links in Shopify emails (password reset, account notifications) will point to your custom domain
- Prevents users from being redirected to myshopify.com when clicking email links
- Maintains consistent user experience

**Steps:**
1. Go to Shopify Admin → Settings → Customer accounts
2. Scroll to "Custom URLs" section (if available on your plan)
3. Enter the URLs above
4. Click "Save"

**Note:** Custom URLs may not be available on all Shopify plans. If not available, users will use Shopify's default customer account pages.

---

### 4. Update Notification Email Templates

**Location:** Shopify Admin → Settings → Notifications

**Templates to Review:**
- Order confirmation
- Shipping confirmation
- Password reset
- Account invitation
- Subscription notifications (if using)

**What to Check:**
- All links should point to `www.dude.box` (not myshopify.com)
- Logo and branding should match your site
- "View order" links should go to your custom portal
- "Shop now" links should go to www.dude.box

**Steps:**
1. Go to Shopify Admin → Settings → Notifications
2. For each email template:
   - Click template name to edit
   - Review HTML/text for any hardcoded myshopify.com URLs
   - Replace with www.dude.box URLs where appropriate
   - Test by sending yourself a test email
3. Click "Save" after each change

**Common URLs to Update:**
- Store URL: `https://www.dude.box`
- Shop URL: `https://www.dude.box`
- Account URL: `https://www.dude.box/portal`

---

### 5. Configure Sales Channels

**Location:** Shopify Admin → Settings → Apps and sales channels

**Online Store Settings:**

1. Go to Settings → Apps and sales channels
2. Click on "Online Store"
3. Configure:
   - **Store name:** Dude.Box
   - **Store URL:** www.dude.box (if applicable)

**What This Does:**
- Ensures Shopify uses your custom domain in various integrations
- Affects how URLs are generated in emails and notifications

---

### 6. Test Payment Settings

**Location:** Shopify Admin → Settings → Payments

**Before Going Live:**
1. Verify test mode is enabled
2. Complete a test transaction to verify:
   - Checkout flow works
   - Returns to www.dude.box after completion
   - Order confirmation sent to correct email

**When Ready for Production:**
1. Disable test mode
2. Verify live payment gateway is active
3. Complete a small real transaction to confirm
4. Monitor for any issues

---

## Verification Checklist

After completing all configurations, test the following:

### Cart and Checkout Flow
- [ ] Add item to cart on www.dude.box
- [ ] Cart badge updates immediately
- [ ] Click checkout button
- [ ] Redirects to Shopify checkout (on your custom domain or myshopify.com)
- [ ] Complete test purchase
- [ ] Redirects back to www.dude.box/thank-you
- [ ] Order appears in customer account at www.dude.box/portal

### Customer Account Flow
- [ ] Register new account at www.dude.box/portal/register
- [ ] Receive confirmation email with correct domain links
- [ ] Click "Forgot password" at www.dude.box/portal/login
- [ ] Receive password reset email
- [ ] Password reset link goes to www.dude.box/portal/reset-password
- [ ] Login and view orders at www.dude.box/portal
- [ ] All navigation stays on www.dude.box (not redirecting to myshopify.com)

### Email Notifications
- [ ] Order confirmation email has www.dude.box links
- [ ] Shipping confirmation email has www.dude.box links
- [ ] Password reset email goes to www.dude.box
- [ ] All emails display your branding correctly

### Logo and Navigation
- [ ] Clicking logo from any page returns to www.dude.box (not myshopify.com)
- [ ] Navigation between pages stays on www.dude.box
- [ ] No unexpected redirects to dudedotbox.myshopify.com

---

## Troubleshooting

### Issue: Users stuck on myshopify.com after clicking logo

**Cause:** Customer account page is using Shopify's default hosted pages instead of your custom frontend.

**Solution:**
1. Verify custom account URLs are set (Step 3)
2. If custom URLs not available on your plan, consider upgrading
3. Alternatively, hide or customize navigation on Shopify's hosted pages

---

### Issue: Checkout redirects to myshopify.com but doesn't return

**Cause:** Order status page URL not configured.

**Solution:**
1. Set order status page URL to `https://www.dude.box/thank-you` (Step 2)
2. Test with a new transaction

---

### Issue: Email links still point to myshopify.com

**Cause:** Email templates not updated.

**Solution:**
1. Review and update notification templates (Step 4)
2. Check for hardcoded URLs in custom sections
3. Test by triggering each notification type

---

### Issue: Cannot add custom checkout domain

**Cause:** Your Shopify plan may not support custom checkout domains.

**Solution:**
1. Keep using myshopify.com for checkout (Option B in Step 1)
2. Ensure order status page URL redirects back to your site
3. This is perfectly acceptable and customers trust Shopify's checkout domain

---

## Additional Resources

- [Shopify Headless Commerce Guide](https://shopify.dev/docs/custom-storefronts)
- [Shopify Storefront API Documentation](https://shopify.dev/docs/api/storefront)
- [Custom Domain Setup](https://help.shopify.com/en/manual/domains)

---

## Support

If you encounter issues with these configurations:
1. Check Shopify's help documentation for your specific plan
2. Contact Shopify Support for plan-specific limitations
3. Review your Next.js app logs for API errors

---

**Document Version:** 1.0.0  
**Last Verified:** 2026-01-26
