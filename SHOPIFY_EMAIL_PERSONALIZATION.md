# Fix Shopify Email Personalization

## Problem
Emails are greeting customers as "Dude" instead of using their actual first name.

## Root Cause
Shopify's default email templates use `{{ shop.name }}` (which is "Dude" in your store settings) instead of `{{ customer.first_name }}` for the greeting.

## Solution: Update Shopify Notification Templates

### Step 1: Access Email Templates

1. Go to **Shopify Admin** → **Settings** → **Notifications**
2. You'll see a list of all customer notification templates

### Step 2: Update Each Customer Email Template

Update these templates (at minimum):

- **Customer account password reset**
- **Customer account welcome**
- **Order confirmation**
- **Order invoice**
- **Shipping confirmation**
- **Shipping update**

### Step 3: Replace the Greeting

In each template, find the greeting section (usually near the top of the HTML) and change:

#### ❌ WRONG (Current):
```liquid
<h1>{{ shop.name }}</h1>
<h2>Reset your password</h2>
```

or

```liquid
<p>Hello {{ shop.name }},</p>
```

#### ✅ CORRECT (Use this):
```liquid
<h1>{% if customer.first_name %}Hi {{ customer.first_name }}{% else %}Hello{% endif %}</h1>
<h2>Reset your password</h2>
```

or

```liquid
<p>{% if customer.first_name %}Hello {{ customer.first_name }}{% else %}Hello{% endif %},</p>
```

### Step 4: Password Reset Template (Complete Example)

For the **Customer account password reset** template specifically, update the email body section:

```liquid
{% capture email_title %}Reset your password{% endcapture %}
{% capture email_body %}
{% if customer.first_name %}
Hi {{ customer.first_name }},
{% else %}
Hello,
{% endif %}

Follow this link to reset your customer account password at {{ shop.name }}. If you didn't request a new password, you can safely delete this email.
{% endcapture %}
```

### Step 5: Order Confirmation Template Example

For **Order confirmation** emails:

```liquid
{% capture email_title %}Thank you for your purchase!{% endcapture %}
{% capture email_body %}
{% if customer.first_name %}
Hi {{ customer.first_name }},
{% else %}
Hello,
{% endif %}

We're getting your order ready to be shipped. We will notify you when it has been sent.
{% endcapture %}
```

## Available Customer Variables in Shopify Emails

You can personalize emails with these variables:

- `{{ customer.first_name }}` - Customer's first name (e.g., "Alex")
- `{{ customer.last_name }}` - Customer's last name (e.g., "Moore")
- `{{ customer.name }}` - Full name (e.g., "Alex Moore")
- `{{ customer.email }}` - Customer's email address

## Fallback for Missing Names

Always use a fallback in case the customer didn't provide their name:

```liquid
{% if customer.first_name %}
Hi {{ customer.first_name }},
{% else %}
Hello,
{% endif %}
```

This ensures that if `first_name` is blank, it will just say "Hello," instead of "Hi ,"

## Quick Test

After updating templates:

1. Click **"Send test email"** button in Shopify
2. Check that it says "Hi [YourFirstName]" not "Hi Dude"
3. Verify the button styling looks correct

## Bonus: Match Your Brand Colors

While you're editing templates, you can also update the button colors to match your site:

```html
<a href="{{ customer.reset_password_url }}" style="background-color: #c79d7a; color: #0f1628; padding: 15px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
  Reset Your Password
</a>
```

- **Background**: `#c79d7a` (your tan/accent color)
- **Text**: `#0f1628` (your dark navy)

## Common Mistakes to Avoid

1. ❌ Don't use `{{ shop.name }}` for greetings
2. ❌ Don't forget the `{% if %}` fallback
3. ❌ Don't use `{{ user.name }}` (doesn't exist - use `customer.first_name`)
4. ✅ Always test emails after making changes
5. ✅ Update ALL customer-facing email templates for consistency

## Need Help?

If you're not seeing the changes:
1. Clear your browser cache
2. Wait 2-3 minutes for Shopify to propagate changes
3. Send a fresh test email
4. Check spam folder if testing with your own email
