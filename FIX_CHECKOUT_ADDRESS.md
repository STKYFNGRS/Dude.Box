# Fix Incomplete Checkout Address Issue

## Immediate Problem
Your checkout is showing "Selected address is incomplete" because there's a partial address saved in Shopify (just "US").

## Quick Fix Options

### Option 1: Fix It During Checkout (Easiest)
1. On the checkout page, click **"Update address"** or **"Use a different address"**
2. Fill in your complete shipping address:
   - Street address
   - City
   - State
   - ZIP code
3. Complete the checkout
4. This address will be saved for future orders

### Option 2: Fix It In Your Portal (Recommended)
1. Go to your **Account** page: https://www.dude.box/portal
2. You'll now see a **"Shipping Address"** card
3. Click **"Add Address"** or **"Edit Address"**
4. Enter your complete shipping address
5. Click **"Save Address"**
6. Next checkout will use this address automatically

### Option 3: Delete Bad Address in Shopify (If needed)
If the partial address keeps appearing:

1. **For Customers:** Go to your portal and save a complete address (it will replace the bad one)
2. **For Admin:** 
   - Go to Shopify Admin → Customers
   - Find the customer (alex_moore19@yahoo.com)
   - Click on their name
   - Scroll to "Default address"
   - Click "Edit" and either fix it or delete it

## What Changed to Prevent This

I've added **Address Management** to your member portal:

**New Features:**
- "Shipping Address" card on portal page
- Add/edit shipping address directly
- Address syncs with Shopify customer account
- Used automatically at checkout

**New Files:**
- `/api/customer/address` - API for managing addresses
- `EditAddressForm` component - UI for editing addresses

## Why This Happened

When you registered with just name/email/password (no address), Shopify created a customer account with no address. Later, if you tried to checkout or Shopify tried to auto-fill, it might have created a partial address entry with just "US".

Now with address management in the portal, users can save complete shipping addresses before checkout.

## User Flow Now

1. **New User:**
   - Registers with name/email/password
   - Goes to portal
   - Adds shipping address (optional but recommended)
   - Checkout is pre-filled

2. **First-Time Checkout (without saved address):**
   - Enters address during checkout
   - Address is saved to Shopify
   - Future checkouts are pre-filled

3. **Existing Customer:**
   - Can update address in portal anytime
   - Address changes reflect immediately in checkout

## Testing

After deployment:
1. Log into your portal
2. Fill out the "Shipping Address" form
3. Save it
4. Go to checkout
5. Address should be pre-filled correctly
6. No more "incomplete address" errors
