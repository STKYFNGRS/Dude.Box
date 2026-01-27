# Stripe Integration Setup Guide

This guide will walk you through completing the Stripe integration for Phase 3.

## ✅ What's Already Done

The following code has been implemented and is ready to use:

- ✅ Stripe SDK installed (`stripe` and `@stripe/stripe-js`)
- ✅ Environment variables configured in `.env.local` and `.env`
- ✅ Stripe utility library created (`src/lib/stripe.ts`)
- ✅ Checkout session API route (`src/app/api/checkout/create-session/route.ts`)
- ✅ Webhook handler with all event processing (`src/app/api/webhooks/stripe/route.ts`)
- ✅ Customer portal API route (`src/app/api/subscriptions/portal/route.ts`)
- ✅ SubscribeButton component (`src/components/SubscribeButton.tsx`)
- ✅ Updated subscription-box page with database integration
- ✅ Updated thank-you page with order confirmation
- ✅ Database seed script for product creation

## 🔧 Manual Steps Required

### Step 1: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Navigate to **Developers > API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

### Step 2: Update Environment Variables

Update your `.env.local` file with the actual Stripe keys:

```env
# Replace these placeholder values with your actual Stripe keys
STRIPE_SECRET_KEY="sk_test_YOUR_ACTUAL_SECRET_KEY"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY"
```

**Note:** The webhook secret will be added in Step 5.

### Step 3: Create Product and Price in Stripe Dashboard

1. In Stripe Dashboard, go to **Products > Add product**
2. Fill in the details:
   - **Name:** `Dude.Box Monthly Subscription`
   - **Description:** `Premium veteran-owned gear delivered monthly`
   - **Pricing model:** Select **Recurring**
   - **Price:** `$59.99`
   - **Billing period:** `Monthly`
3. Click **Save product**
4. On the product page, find the **Price ID** (starts with `price_`)
5. **Copy this Price ID** - you'll need it in the next step

### Step 4: Add Product to Database

#### Option A: Using Prisma Studio (Recommended)

1. Run Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Navigate to the **Product** model
3. Click **Add record**
4. Fill in the fields:
   - **name:** `Dude.Box Monthly Subscription`
   - **description:** `Premium, veteran-owned gear delivered monthly`
   - **price:** `59.99`
   - **interval:** `month`
   - **stripe_price_id:** `price_XXXXX` (paste the Price ID from Stripe)
   - **active:** `true`
5. Click **Save 1 change**

#### Option B: Using the Seed Script

1. Open `prisma/seed.ts`
2. Replace `YOUR_STRIPE_PRICE_ID` with your actual Stripe Price ID
3. Run the seed script:
   ```bash
   npx tsx prisma/seed.ts
   ```

### Step 5: Set Up Stripe Webhooks

#### For Local Development (Stripe CLI)

1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the **webhook signing secret** that appears (starts with `whsec_`)

5. Add it to your `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_YOUR_LOCAL_WEBHOOK_SECRET"
   ```

6. Keep the `stripe listen` command running in a terminal while testing

#### For Production (Vercel)

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Enter the endpoint URL:
   ```
   https://www.dude.box/api/webhooks/stripe
   ```
4. Select the following events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. On the webhook detail page, click **Reveal** under **Signing secret**
7. Copy the webhook secret (starts with `whsec_`)
8. Add it to Vercel environment variables:
   - Go to Vercel dashboard > Your project > Settings > Environment Variables
   - Add `STRIPE_WEBHOOK_SECRET` with the production webhook secret

### Step 6: Update Production Environment Variables

In Vercel dashboard, make sure you have these environment variables set:

```env
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... (from Step 5)
```

## 🧪 Testing

### Test the Complete Flow

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Make sure Stripe CLI is forwarding webhooks:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Navigate to the subscription page:**
   - Go to `http://localhost:3000/products/subscription-box`
   - You should see the product price loaded from the database

4. **Register or login:**
   - Create a test account or login to an existing one

5. **Click "Start Subscription":**
   - You should be redirected to Stripe Checkout
   - The form should be pre-filled with your email

6. **Use a test card:**
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

7. **Complete the payment:**
   - You should be redirected to `/thank-you` page
   - Order details should display

8. **Verify in database (Prisma Studio):**
   ```bash
   npx prisma studio
   ```
   - Check **Subscription** table: Should have a new record
   - Check **Order** table: Should have a new order record
   - Check **OrderItem** table: Should have the order item

9. **Check webhook logs:**
   - Look at the terminal running `stripe listen`
   - You should see `checkout.session.completed` event
   - Check your dev server logs for webhook processing

### Test Customer Portal

1. **After creating a subscription, go to `/portal`**
2. **Click "Manage Subscription"** (if you've added that button)
3. **Or create a test component:**
   ```tsx
   // Add this button to test portal access
   <button onClick={async () => {
     const res = await fetch('/api/subscriptions/portal', { method: 'POST' });
     const data = await res.json();
     window.location.href = data.url;
   }}>
     Manage Subscription
   </button>
   ```
4. **Verify you can:**
   - Update payment method
   - Cancel subscription
   - View billing history

### Test Subscription Updates

1. **In Stripe Dashboard, go to Customers**
2. **Find the test customer**
3. **Cancel their subscription**
4. **Check database:**
   - Subscription status should update to "cancelled"
   - Check webhook logs for `customer.subscription.deleted` event

## 🧪 Test Card Numbers

Stripe provides test cards for different scenarios:

- **Successful payment:** `4242 4242 4242 4242`
- **Declined card:** `4000 0000 0000 0002`
- **Requires authentication:** `4000 0025 0000 3155`
- **Insufficient funds:** `4000 0000 0000 9995`

More test cards: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

## 🚀 Going to Production

When ready to accept real payments:

1. **Create product in Stripe Live Mode:**
   - Switch to Live mode in Stripe Dashboard
   - Create the same product with live Price ID

2. **Update database:**
   - Add the live Stripe Price ID to the product record
   - Or create a new product record for live mode

3. **Update environment variables:**
   - Replace test keys with live keys:
     - `STRIPE_SECRET_KEY=sk_live_...`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - Update webhook secret to production webhook secret

4. **Configure production webhook:**
   - Add production endpoint in Stripe Dashboard
   - Use the production URL: `https://www.dude.box/api/webhooks/stripe`

5. **Test with real card:**
   - Use a real card for testing
   - Immediately refund the test transaction

## ✅ Completion Checklist

- [ ] Stripe API keys added to `.env.local`
- [ ] Product and price created in Stripe Dashboard
- [ ] Product added to database with Stripe Price ID
- [ ] Stripe CLI installed and webhook forwarding working
- [ ] Webhook secret added to environment variables
- [ ] Test subscription completed successfully
- [ ] Subscription record created in database
- [ ] Order record created in database
- [ ] Thank you page displays order details
- [ ] Customer portal accessible and functional
- [ ] Webhook events processing correctly

## 📚 Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Stripe Test Cards](https://stripe.com/docs/testing)

## 🆘 Troubleshooting

### "Product Setup Required" button shows instead of Subscribe button

**Solution:** Make sure the product exists in the database with a valid `stripe_price_id`.

### Webhook signature verification fails

**Solution:** 
- Make sure `STRIPE_WEBHOOK_SECRET` is set correctly
- For local dev, use the secret from `stripe listen` command
- For production, use the secret from Stripe Dashboard webhook settings

### Checkout session creation fails

**Solution:**
- Check that `STRIPE_SECRET_KEY` is set correctly
- Make sure user is logged in (check session)
- Verify the Price ID is valid in Stripe

### Database records not created after payment

**Solution:**
- Check webhook is configured and receiving events
- Look at webhook logs in terminal (if using Stripe CLI)
- Check application logs for errors in webhook handler
- Verify userId is in session metadata

### Customer portal returns 404

**Solution:**
- User must have an active subscription
- Check that subscription record exists in database
- Verify `stripe_customer_id` is set correctly

---

**Need help?** Check the logs in:
- Browser console (F12)
- Terminal running dev server
- Terminal running `stripe listen`
- Vercel deployment logs (for production)
