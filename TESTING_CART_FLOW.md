# Cart Flow Testing Guide

**Last Updated:** 2026-01-26  
**Purpose:** Verify cart quantity updates and checkout flow after fixing cart issues

---

## Pre-Testing Setup

### 1. Ensure Development Environment is Running

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

### 2. Open Browser DevTools

- Press F12 or right-click → Inspect
- Go to Console tab
- Go to Network tab (to monitor API calls)
- Clear console before testing

---

## Test Scenario 1: Add to Cart Flow

### Test Steps

1. **Navigate to homepage**
   - Go to `http://localhost:3000`
   - Scroll to the shop section

2. **Add item to cart**
   - Click "Add to Cart" on any product
   - **Expected Results:**
     - Button shows "Adding..." briefly
     - Message "Added to cart." appears
     - Header cart badge updates **immediately** to show count (e.g., "1")
     - No page reload occurs

3. **Verify in Console**
   - Check Console for `cart:updated` event
   - Event should contain: `{ detail: { totalQuantity: 1 } }`
   - **NOT** `{ detail: { totalQuantity: undefined } }` ❌

4. **Verify Network Request**
   - Check Network tab for POST to `/api/cart`
   - Request body should have: `{ action: "addLines", lines: [...] }`
   - Response should contain: `{ cart: { totalQuantity: 1, ... } }`

### Expected Behavior

✅ Cart badge updates from 0 to 1 immediately  
✅ No extra GET request to `/api/cart` needed  
✅ Console shows correct totalQuantity in event  
✅ No JavaScript errors

### If Test Fails

❌ Badge doesn't update → Check if event is dispatched with correct totalQuantity  
❌ Extra API call made → Verify ProductAddToCartButton extracts cart from response  
❌ Undefined totalQuantity → Check API response structure

---

## Test Scenario 2: Cart Drawer Display

### Test Steps

1. **Open cart drawer**
   - Click the cart icon in header
   - **Expected Results:**
     - Drawer slides in from right
     - Shows "Loading cart…" briefly
     - Displays added product with correct quantity
     - Shows subtotal

2. **Verify cart contents**
   - Product name should match what was added
   - Quantity should show "Qty 1"
   - Price should be displayed
   - Subtotal should calculate correctly

3. **Check Console**
   - Should see GET request to `/api/cart`
   - Should see `cart:updated` event dispatched
   - No errors in console

### Expected Behavior

✅ Drawer opens smoothly  
✅ Cart loads within 1-2 seconds  
✅ Product details display correctly  
✅ Quantity matches cart badge

### If Test Fails

❌ Drawer shows empty cart → Check if cart cookie is set correctly  
❌ Loading never finishes → Check API errors in Network tab  
❌ Wrong quantity → Verify cart state is being set correctly

---

## Test Scenario 3: Update Quantity in Cart

### Test Steps

1. **Increase quantity**
   - In open cart drawer
   - Click "+" button next to item
   - **Expected Results:**
     - Quantity updates to 2
     - Subtotal recalculates
     - Cart badge in header updates to 2
     - Loading state shows briefly

2. **Decrease quantity**
   - Click "-" button
   - **Expected Results:**
     - Quantity decreases to 1
     - Subtotal updates
     - Cart badge updates to 1

3. **Remove item**
   - Click "Remove" button
   - **Expected Results:**
     - Item removed from cart
     - Shows "Your cart is empty."
     - Cart badge shows 0

### Expected Behavior

✅ Quantity updates immediately  
✅ Cart badge syncs with cart contents  
✅ Subtotal recalculates correctly  
✅ Remove button clears cart

### If Test Fails

❌ Quantity doesn't update → Check updateLineQuantity function  
❌ Badge out of sync → Verify emitCartUpdate is called  
❌ Remove fails → Check removeLines API call

---

## Test Scenario 4: Checkout Button Flow

### Test Steps

1. **Prepare cart**
   - Add at least one item to cart
   - Open cart drawer
   - Verify item is shown with correct quantity

2. **Click Checkout button**
   - **Expected Results:**
     - Button should NOT redirect to `/shop`
     - Should show loading state briefly
     - Should redirect to Shopify checkout URL
     - URL should be `dudedotbox.myshopify.com/checkouts/...` or `checkout.dude.box/...`

3. **Verify redirect**
   - Should land on Shopify's checkout page
   - Cart items should appear on checkout
   - Quantities should match

### Expected Behavior

✅ Checkout button is enabled when cart has items  
✅ Redirects to Shopify checkout (not /shop)  
✅ No errors during checkout initiation  
✅ Cart items appear on Shopify checkout

### If Test Fails

❌ Redirects to /shop → Check if cart.totalQuantity is properly set  
❌ Checkout URL missing → Check getCheckoutUrl API response  
❌ Error message shown → Check console for API errors

---

## Test Scenario 5: Empty Cart Checkout

### Test Steps

1. **Start with empty cart**
   - Clear all items from cart
   - Close and reopen cart drawer
   - Verify "Your cart is empty." message

2. **Click Checkout button**
   - **Expected Results:**
     - Should redirect to `/shop` (which redirects to `/#shop`)
     - This is correct behavior for empty cart

### Expected Behavior

✅ Empty cart shows appropriate message  
✅ Checkout with empty cart redirects to shop  
✅ No JavaScript errors

---

## Test Scenario 6: Cross-Browser Cart Sync

### Test Steps

1. **Add item in browser A**
   - Add product to cart
   - Note cart cookie is set

2. **Open same site in browser B (or incognito)**
   - Cart should be empty (different session)
   - This is expected behavior with cookie-based carts

3. **Test cart persistence in same browser**
   - Add items to cart
   - Close browser tab
   - Reopen site
   - Cart should still contain items (cookie persists)

### Expected Behavior

✅ Cart is session-based (per browser)  
✅ Cart persists in same browser session  
✅ Different browsers have separate carts

---

## Test Scenario 7: Customer Login and Cart Association

### Test Steps

1. **Add items to cart as guest**
   - Add 2 items to cart
   - Note cart count is 2

2. **Login to customer account**
   - Click "Login" button
   - Enter credentials
   - Login successfully

3. **Verify cart after login**
   - **Expected Results:**
     - Cart should still contain 2 items
     - Cart should now be associated with customer account
     - Cart persists after login

4. **Check Console**
   - Should see `associateCustomer` API call
   - Should see `user:login` event
   - Cart should reload

### Expected Behavior

✅ Guest cart persists after login  
✅ Cart associates with customer account  
✅ No items lost during login  
✅ Cart badge remains accurate

---

## Integration Test: Complete Purchase Flow

### Full End-to-End Test

1. **Browse products** → Homepage loads, products display
2. **Add to cart** → Item added, badge updates to 1
3. **Add second item** → Badge updates to 2
4. **Open cart drawer** → Shows both items correctly
5. **Update quantity** → Increase first item to 3, badge shows 4 total
6. **Remove one item** → Remove second item, badge shows 3
7. **Proceed to checkout** → Click Checkout button
8. **Shopify checkout** → Redirects to Shopify, items appear
9. **Complete payment** → Fill in details, complete purchase
10. **Return to site** → Should redirect to `www.dude.box/thank-you`
11. **View order** → Login and check order history at `/portal`

### Expected Behavior

✅ Entire flow works without errors  
✅ Cart quantities always accurate  
✅ Checkout completes successfully  
✅ Redirects back to custom domain  
✅ Order appears in customer account

---

## API Testing

### Test API Endpoints Directly

Use browser console or Postman:

```javascript
// Test 1: Get current cart
fetch('/api/cart', { method: 'GET' })
  .then(r => r.json())
  .then(console.log);
// Expected: { cartId: "...", cart: { totalQuantity: 0, ... } }

// Test 2: Add item to cart
fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'addLines',
    lines: [{ merchandiseId: 'gid://shopify/ProductVariant/...', quantity: 1 }]
  })
})
  .then(r => r.json())
  .then(console.log);
// Expected: { cartId: "...", cart: { totalQuantity: 1, ... } }

// Test 3: Get checkout URL
fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'getCheckoutUrl' })
})
  .then(r => r.json())
  .then(console.log);
// Expected: { cartId: "...", checkoutUrl: "https://..." }
```

---

## Common Issues and Solutions

### Issue: Cart badge doesn't update

**Debug Steps:**
1. Check Console for `cart:updated` event
2. Verify event detail contains `totalQuantity`
3. Check if `ProductAddToCartButton` extracts cart from API response
4. Verify `SiteHeader` is listening for events

**Fix Location:** `src/components/ProductAddToCartButton.tsx` line 40-46

---

### Issue: Checkout redirects to /shop

**Debug Steps:**
1. Check if `cart.totalQuantity` is set and > 0
2. Verify cart state is loaded in CartDrawer
3. Check Console for errors during checkout

**Fix Location:** `src/components/CartDrawer.tsx` line 296

---

### Issue: Quantities out of sync

**Debug Steps:**
1. Open cart drawer and check if it reloads cart
2. Verify all cart operations emit `cart:updated` event
3. Check if header is listening for events

**Fix Location:** `src/components/SiteHeader.tsx` lines 30-42

---

## Success Criteria

All tests should pass with these results:

- ✅ Cart badge updates immediately when adding items
- ✅ No extra API calls needed for cart count
- ✅ Cart drawer displays correct quantities
- ✅ Quantity updates work smoothly
- ✅ Checkout button redirects to Shopify (not /shop)
- ✅ No JavaScript console errors
- ✅ Cart persists across page refreshes
- ✅ Cart associates with customer on login

---

## Test Results Log

**Date:** _____________  
**Tester:** _____________  
**Environment:** ☐ Local ☐ Staging ☐ Production

| Test Scenario | Status | Notes |
|---------------|--------|-------|
| Add to Cart | ☐ Pass ☐ Fail | |
| Cart Drawer Display | ☐ Pass ☐ Fail | |
| Update Quantity | ☐ Pass ☐ Fail | |
| Checkout Flow | ☐ Pass ☐ Fail | |
| Empty Cart | ☐ Pass ☐ Fail | |
| Cart Persistence | ☐ Pass ☐ Fail | |
| Customer Login | ☐ Pass ☐ Fail | |
| Complete Purchase | ☐ Pass ☐ Fail | |

**Overall Status:** ☐ All Pass ☐ Some Failures

**Issues Found:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-26
