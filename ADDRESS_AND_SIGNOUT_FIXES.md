# Address Update & Sign Out Fixes

## Issues Fixed

### Issue 1: Address Not Actually Updating
**Problem:** Form showed "Address updated successfully!" but the address in Shopify wasn't actually changing.

**Root Cause:** 
- The `customerDefaultAddressUpdate` mutation only works if a default address already exists
- For new customers or customers without saved addresses, we need to use `customerAddressCreate` instead
- The form wasn't waiting for Shopify to process the update before refreshing

**Solution:**
1. Check if customer has an existing default address
2. Use `customerAddressCreate` if no address exists
3. Use `customerDefaultAddressUpdate` if address exists
4. Set newly created address as default
5. Wait 1 second for Shopify to process before refreshing

### Issue 2: Sign Out Doesn't Clear Shopify Session
**Problem:** Signing out on the main site doesn't sign out from Shopify checkout - cart still showed customer info.

**Root Cause:**
- NextAuth signout only clears your site's session
- The Shopify cart maintains its own buyer identity with a `customerAccessToken`
- Cart cookie persists after logout, keeping customer associated

**Solution:**
1. Created `/api/auth/signout-handler` endpoint
2. When user signs out, clear the cart's buyer identity in Shopify
3. Set `customerAccessToken: null` and `email: null` on cart
4. This makes checkout appear as guest checkout

## Files Changed

### New Files:
- `src/app/api/auth/signout-handler/route.ts` - Clears Shopify cart association

### Updated Files:
1. **`src/app/api/customer/address/route.ts`**
   - Added logic to check for existing address
   - Uses `customerAddressCreate` for new addresses
   - Uses `customerDefaultAddressUpdate` for existing addresses
   - Sets newly created address as default

2. **`src/components/EditAddressForm.tsx`**
   - Adds 1-second delay after save for Shopify processing
   - Refetches address before closing form
   - Ensures UI shows updated data

3. **`src/components/SignOutButton.tsx`**
   - Calls `/api/auth/signout-handler` before signing out
   - Clears cart association first
   - Then signs out of NextAuth

4. **`src/components/CartSync.tsx`**
   - Detects when user becomes unauthenticated
   - Automatically clears cart association on logout

## How It Works Now

### Address Update Flow:

```mermaid
graph TD
    A[User Edits Address] --> B[Submit Form]
    B --> C{Default Address Exists?}
    C -->|Yes| D[customerDefaultAddressUpdate]
    C -->|No| E[customerAddressCreate]
    E --> F[Set as Default]
    D --> G[Wait 1 second]
    F --> G
    G --> H[Refresh Address Data]
    H --> I[Show Updated Address]
```

### Sign Out Flow:

```mermaid
graph TD
    A[User Clicks Sign Out] --> B[Clear Cart Buyer Identity]
    B --> C[Set customerAccessToken = null]
    C --> D[Set email = null]
    D --> E[Sign Out NextAuth Session]
    E --> F[Redirect to Home]
    F --> G[Checkout Shows Guest Mode]
```

## Testing

### Test Address Update:
1. Go to portal → Shipping Address
2. Click "Edit Address"
3. Enter complete address:
   - Street: 4670 Orten St
   - City: San Diego
   - State: CA
   - ZIP: 92110
4. Click "Save Address"
5. Should see success message
6. Address should display correctly (not just "United States")
7. Go to checkout → Address should be pre-filled

### Test Sign Out:
1. Log in to your account
2. Add item to cart
3. Go to checkout → Should see your name and address
4. Go back to site
5. Click "Sign Out"
6. Go to checkout again
7. Should appear as guest (no name/address pre-filled)

## Why These Issues Happened

### Address Issue:
Shopify has two different GraphQL mutations for addresses:
- `customerAddressCreate` - Creates a NEW address
- `customerDefaultAddressUpdate` - Updates EXISTING default address

We were only using the update mutation, which fails silently if no address exists yet.

### Sign Out Issue:
Headless checkout creates a separation between:
- **Your site's auth** (NextAuth sessions)
- **Shopify's cart** (buyer identity with customerAccessToken)

These are independent systems. Signing out of NextAuth doesn't automatically clear Shopify's cart data.

## API Details

### Clear Cart Buyer Identity:

```typescript
mutation cartBuyerIdentityUpdate($cartId: ID!) {
  cartBuyerIdentityUpdate(
    cartId: $cartId, 
    buyerIdentity: {
      email: null,
      customerAccessToken: null
    }
  ) {
    cart { id }
  }
}
```

This tells Shopify: "This cart no longer belongs to a customer"

### Address Creation vs Update:

```typescript
// For NEW addresses:
mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
  customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
    customerAddress { id }
  }
}

// For EXISTING addresses:
mutation customerDefaultAddressUpdate($customerAccessToken: String!, $address: MailingAddressInput!) {
  customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, address: $address) {
    customer { id }
  }
}
```

## Edge Cases Handled

1. **User with no address** → Creates new address, sets as default
2. **User with existing address** → Updates existing default address
3. **Sign out with empty cart** → Handles gracefully, no errors
4. **Network failure during signout** → Still completes NextAuth signout
5. **Multiple rapid address updates** → 1-second delay prevents race conditions

## Security Notes

- All mutations require valid `customerAccessToken`
- Can only update own address (validated by Shopify)
- Cart clearing on logout prevents info leakage
- Server-side session validation prevents unauthorized access

## Future Improvements

Potential enhancements:
1. Allow multiple saved addresses (not just default)
2. Show loading spinner during address save
3. Add address validation (USPS API)
4. Implement address autocomplete
5. Show confirmation before sign out
6. Clear cart items on sign out (optional)
