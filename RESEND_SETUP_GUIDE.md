# Resend Email Setup Guide

This guide will help you set up Resend for sending automated emails from Dude.Box.

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" (it's free - 100 emails/day, 3,000/month)
3. Verify your email address

## Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the left sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Dude.Box Production")
5. Copy the API key (starts with `re_...`)

## Step 3: Add Domain (Optional but Recommended)

To send from `noreply@dude.box` instead of `onboarding@resend.dev`:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain: `dude.box`
4. Follow the DNS verification steps:
   - Add the provided DNS records to your domain registrar
   - Common records needed:
     - SPF record (TXT)
     - DKIM records (TXT)
     - DMARC record (TXT)
5. Wait for verification (usually 5-15 minutes)
6. Once verified, you can send from any `@dude.box` email address

## Step 4: Update Environment Variables

Add your Resend API key to your environment files:

### Local Development (`.env.local`):
```env
RESEND_API_KEY="re_YOUR_ACTUAL_API_KEY_HERE"
RESEND_FROM_EMAIL="noreply@dude.box"
```

### Production (Vercel Dashboard):
1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_YOUR_ACTUAL_API_KEY_HERE`
   - **Environments:** Production, Preview, Development
4. Add:
   - **Key:** `RESEND_FROM_EMAIL`
   - **Value:** `noreply@dude.box`
   - **Environments:** Production, Preview, Development
5. Click **Save**
6. Redeploy your application for changes to take effect

## Step 5: Test Email Sending

### Test 1: Order & Subscription Confirmation Emails
1. Make a test purchase on your site
2. Check your email inbox (the one used during checkout)
3. You should receive:
   - ✅ Subscription confirmation email
   - ✅ Order confirmation email

### Test 2: Password Reset Email
1. Go to `/portal/forgot-password`
2. Enter your email address
3. Check your inbox for the password reset email
4. Click the reset link and set a new password

## Email Templates Included

Your site now sends these automated emails:

1. **Order Confirmation**
   - Sent when a payment is successful
   - Includes order details, items, and total
   - Link to view order in portal

2. **Subscription Confirmation**
   - Sent when a new subscription is created
   - Includes next billing date and subscription details
   - Link to manage subscription

3. **Password Reset**
   - Sent when user requests password recovery
   - Includes secure reset link (expires in 1 hour)
   - Safe from user enumeration attacks

## Email Customization

All email templates are in `src/lib/email.ts`. You can customize:

- **Colors & Branding:** Update the gradient colors in the email HTML
- **Company Name:** Already using "Dude.Box" from constants
- **Email Content:** Edit the text in each email function
- **Styling:** Inline CSS is used for email compatibility

## Pricing

**Resend Free Tier:**
- 3,000 emails per month
- 100 emails per day
- Perfect for getting started

**Paid Plans:**
- Start at $20/month for 50,000 emails
- Scale as you grow

## Troubleshooting

### Emails Not Sending?
1. Check if `RESEND_API_KEY` is set correctly
2. Look in your server logs for error messages
3. Verify your Resend account is active
4. Check Resend dashboard for delivery logs

### Emails Going to Spam?
1. Add your domain to Resend (don't use default `resend.dev`)
2. Set up SPF, DKIM, and DMARC records
3. Warm up your domain by sending gradually increasing volumes
4. Add an unsubscribe link (for marketing emails)

### Domain Not Verifying?
1. DNS records can take 24-48 hours to propagate
2. Use a DNS checker tool to verify records are published
3. Contact your domain registrar if needed

## Support

- **Resend Docs:** https://resend.com/docs
- **Resend Support:** support@resend.com
- **Your Code:** All email logic is in `src/lib/email.ts`

---

## Quick Start (TL;DR)

1. Sign up at resend.com
2. Copy your API key
3. Update `.env.local`:
   ```
   RESEND_API_KEY="re_YOUR_KEY"
   RESEND_FROM_EMAIL="noreply@dude.box"
   ```
4. Restart dev server: `npm run dev`
5. Test by making a purchase or requesting password reset
6. Check your email!

**That's it! Your emails are now automated.** 🎉
