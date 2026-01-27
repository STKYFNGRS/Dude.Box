# Stripe Integration Testing Guide

## Problem Found & Fixed

### Issues Identified:
1. ✅ **FIXED**: Stripe CLI webhook forwarder was not running during checkout test
2. ✅ **FIXED**: Portal page was using old Shopify code instead of Prisma database queries
3. ✅ **FIXED**: Added `stripe_customer_id` field to User model
4. ✅ **FIXED**: Improved webhook handler logging

### What Was Changed:
- Updated `src/app/portal/page.tsx` to query Prisma database for subscriptions and orders
- Added `stripe_customer_id` field to User model in `prisma/schema.prisma`
- Updated webhook handler to store `stripe_customer_id` in User record
- Enhanced webhook logging for better debugging

---

## Complete Testing Instructions

### Step 1: Start Stripe CLI Webhook Forwarder

**IMPORTANT**: This must be running for webhooks to work in development!

Open a **NEW terminal** (keep your dev server running in the other terminal):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You should see output like:
```
> Ready! You are using Stripe API Version [2025-12-15]. Your webhook signing secret is whsec_xxxxx
```

**Copy the webhook signing secret** that starts with `whsec_`

### Step 2: Update Environment Variable

Update your `.env.development.local` file with the webhook secret:

```env
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"  # Use the secret from Step 1
```

### Step 3: Restart Dev Server

In the terminal running `npm run dev`:
1. Press `Ctrl+C` to stop
2. Run `npm run dev` again

### Step 4: Test Complete Checkout Flow

1. **Go to subscription page**: http://localhost:3000/products/subscription-box

2. **Click "Start Subscription"** button

3. **Fill out Stripe test card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - Name: Any name
   - ZIP: Any 5 digits (e.g., `12345`)

4. **Click Subscribe**

### Step 5: Verify Webhook Reception

In the terminal running `stripe listen`, you should see:

```
✅ checkout.session.completed
✅ customer.subscription.created
✅ invoice.payment_succeeded
```

In the dev server terminal (`npm run dev`), you should see:

```
✅ Received webhook event: checkout.session.completed
📦 Processing checkout for session: cs_test_xxxxx
✅ Successfully processed checkout.session.completed
```

### Step 6: Verify Database Records

Open Prisma Studio:
```bash
npx prisma studio
```

Check that the following were created:
- **User** has `stripe_customer_id` populated
- **Subscription** record exists with status "active"
- **Order** record exists with status "paid"
- **OrderItem** record exists

### Step 7: Verify Portal Page

Go to: http://localhost:3000/portal

You should now see:
- **Profile** section with your name and email
- **Subscription status** showing "Active Subscription" with renewal date
- **Order History** showing your order

### Step 8: Test Customer Portal Link

On the portal page, click **"Manage Subscription →"**

This should redirect you to the Stripe Customer Portal where you can:
- Update payment method
- View invoices
- Cancel subscription

---

## Troubleshooting

### Webhooks Not Received

**Problem**: No webhook events showing in Stripe CLI terminal

**Solution**: 
- Make sure `stripe listen` is running
- Check that the command shows "Ready!"
- Verify you're forwarding to the correct URL: `localhost:3000/api/webhooks/stripe`

### Webhook Signature Verification Failed

**Problem**: Dev server shows "Webhook signature verification failed"

**Solution**:
- Copy the webhook secret from `stripe listen` output
- Update `STRIPE_WEBHOOK_SECRET` in `.env.development.local`
- Restart dev server

### No Subscription Data in Portal

**Problem**: Portal still shows "No orders yet"

**Solution**:
1. Check Prisma Studio to see if records were created
2. If no records exist, webhooks weren't processed
3. Verify `stripe listen` was running during checkout
4. Check dev server logs for webhook errors
5. Try the checkout flow again

### Database Query Errors

**Problem**: Errors about missing fields or relations

**Solution**:
- Make sure you ran `npx prisma db push`
- Verify schema is in sync: `npx prisma generate`
- Restart dev server

---

## Test Card Numbers

For testing different scenarios:

| Scenario | Card Number | Description |
|----------|-------------|-------------|
| Success | `4242 4242 4242 4242` | Successful payment |
| Decline | `4000 0000 0000 0002` | Card declined |
| Insufficient funds | `4000 0000 0000 9995` | Insufficient funds |
| Expired card | `4000 0000 0000 0069` | Expired card |
| 3D Secure | `4000 0025 0000 3155` | Requires authentication |

---

## Next Steps After Testing

Once you verify everything works locally:

1. **For Production**: 
   - Get LIVE mode API keys from Stripe Dashboard
   - Configure production webhook endpoint in Stripe Dashboard
   - Update `.env` with live keys (NOT test keys)

2. **Important Security Notes**:
   - Never commit `.env` files to git
   - Use different webhook secrets for dev/prod
   - Test webhook endpoints thoroughly before going live

---

## Support

If you encounter any issues:
1. Check the dev server logs for errors
2. Check Stripe CLI logs for webhook events
3. Verify database records in Prisma Studio
4. Review this guide's troubleshooting section
