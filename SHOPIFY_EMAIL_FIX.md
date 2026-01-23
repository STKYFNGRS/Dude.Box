# Fix for Email Button Text Not Showing

## Problem
The button text "Reset your password" is not visible in the email because Shopify's template CSS classes are interfering.

## Solution: Use Plain HTML with Inline Styles Only

In your Shopify email template, find the reset button section and replace it with this:

### Option 1: Simple Centered Button (Recommended)

```html
<tr>
  <td align="center" style="padding: 30px 0;">
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="background-color: #c79d7a; border-radius: 50px;">
          <a href="https://dude.box/portal/reset-password?id={{ customer.id | split: '/' | last }}&token={{ customer.reset_password_url | split: '/' | last }}" target="_blank" style="display: inline-block; padding: 15px 40px; color: #0f1628; text-decoration: none; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
            Reset your password
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### Option 2: Full Width Button

```html
<tr>
  <td style="padding: 30px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="background-color: #c79d7a; border-radius: 50px; padding: 15px;">
          <a href="https://dude.box/portal/reset-password?id={{ customer.id | split: '/' | last }}&token={{ customer.reset_password_url | split: '/' | last }}" target="_blank" style="display: block; color: #0f1628; text-decoration: none; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
            Reset your password
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### Option 3: Simple Link Style (Fallback)

If tables aren't working, use the absolute simplest approach:

```html
<p align="center" style="margin: 30px 0;">
  <a href="https://dude.box/portal/reset-password?id={{ customer.id | split: '/' | last }}&token={{ customer.reset_password_url | split: '/' | last }}" style="background-color: #c79d7a; color: #0f1628; padding: 15px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
    Reset your password
  </a>
</p>
```

## Key Differences from Your Current Code:

1. **NO CLASSES** - Removed `class="f-fallback button"` completely
2. **Inline styles only** - All styling is in the `style` attribute
3. **Explicit text** - "Reset your password" is directly in the HTML
4. **Simple structure** - No reliance on Shopify's template framework

## Testing Steps:

1. Replace the button code in Shopify
2. Click "Send test email"
3. Check your inbox
4. Verify button text is visible and colored tan (#c79d7a)
5. Click button to test the link

## Colors Reference:
- **Button background**: `#c79d7a` (tan/beige)
- **Button text**: `#0f1628` (dark navy)
- These match your "Digital Underground" brand aesthetic

## If Still Not Working:

Check if Shopify's notification template has a `<style>` block that might be overriding. Look for:

```liquid
<style>
  .button { ... }
  a { color: ... !important; }
</style>
```

If found, you can either:
1. Remove those style rules
2. Add `!important` to your inline styles
3. Use the simplest Option 3 above which avoids all conflicts
