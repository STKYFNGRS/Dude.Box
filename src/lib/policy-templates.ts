/**
 * Industry-standard shipping and return policy templates
 * Based on Etsy and Shopify marketplace standards
 */

export interface PolicyTemplate {
  id: string;
  name: string;
  text: string;
}

// SHIPPING POLICY TEMPLATES

export const SHIPPING_TEMPLATES: PolicyTemplate[] = [
  {
    id: "standard-domestic",
    name: "Standard Domestic Shipping (3-5 business days)",
    text: `**Processing Time:** Orders are processed within 1-2 business days. Please note that processing time is separate from shipping time.

**Shipping Method:** All orders ship via USPS First Class or Priority Mail, depending on package weight and destination.

**Delivery Time:** Standard domestic shipping typically takes 3-5 business days after processing. Delivery times may vary during peak seasons.

**Tracking:** All orders include tracking information, which will be emailed to you once your order ships.

**Shipping Costs:** Calculated at checkout based on your location and order weight.

**International Shipping:** Not currently available.`,
  },
  {
    id: "expedited",
    name: "Expedited Shipping Available",
    text: `**Processing Time:** Orders are processed within 1 business day for expedited orders, 1-2 business days for standard orders.

**Shipping Options:**
- Standard (3-5 business days): USPS First Class Mail
- Expedited (2-3 business days): USPS Priority Mail
- Express (1-2 business days): USPS Priority Mail Express

**Tracking:** All orders include tracking information, which will be emailed to you once your order ships.

**Shipping Costs:** Calculated at checkout based on your selected shipping method, location, and order weight.

**International Shipping:** Available to select countries. International orders may take 7-21 business days and may be subject to customs fees.`,
  },
  {
    id: "free-shipping",
    name: "Free Shipping Over $50",
    text: `**Processing Time:** Orders are processed within 1-2 business days.

**Shipping Costs:**
- Orders over $50: FREE standard shipping
- Orders under $50: Flat rate $5.99 standard shipping

**Delivery Time:** Standard shipping typically takes 3-5 business days after processing.

**Tracking:** All orders include free tracking information, which will be emailed to you once your order ships.

**Shipping Method:** USPS First Class or Priority Mail depending on package size and destination.

**Note:** Free shipping applies to domestic orders only. International shipping rates apply at checkout.`,
  },
  {
    id: "made-to-order",
    name: "Made to Order (Extended Processing)",
    text: `**Important:** All items are handmade to order. Please allow adequate time for creation and shipping.

**Processing Time:** 1-2 weeks for production, depending on current order volume. Processing time is separate from shipping time.

**Shipping Method:** USPS Priority Mail

**Delivery Time:** 2-3 business days after item is completed and shipped.

**Total Time:** Please allow 2-3 weeks total from order date to delivery.

**Tracking:** You will receive tracking information via email once your item ships.

**Rush Orders:** Contact us before ordering if you need your item by a specific date. Rush processing may be available for an additional fee.`,
  },
  {
    id: "local-pickup",
    name: "Local Pickup Available",
    text: `**Processing Time:** Orders are processed within 1-2 business days.

**Pickup Options:**
- **Local Pickup:** Available at no charge. Choose "Local Pickup" at checkout and we'll email you when your order is ready (typically within 1-2 business days).
- **Shipping:** Standard USPS shipping available for all orders. Delivery in 3-5 business days.

**Pickup Location:** [Your location/studio address] - Pickup address will be provided in your order confirmation email.

**Pickup Hours:** By appointment only. Please arrange pickup time via email after receiving your ready notification.`,
  },
];

// RETURN POLICY TEMPLATES

export const RETURN_TEMPLATES: PolicyTemplate[] = [
  {
    id: "30-day-return",
    name: "30-Day Returns Accepted",
    text: `**Return Window:** Items may be returned within 30 days of delivery for a full refund.

**Condition:** Items must be unused, in original condition, and in original packaging.

**Process:** Contact us to initiate a return. Return shipping label will be provided via email. Once we receive and inspect the returned item, your refund will be processed within 5-7 business days.

**Return Shipping:** Buyer is responsible for return shipping costs unless the item is defective or damaged.

**Non-Returnable Items:** Custom or personalized items cannot be returned unless defective.

**Refund Method:** Refunds will be issued to the original payment method.`,
  },
  {
    id: "14-day-exchange",
    name: "14-Day Exchanges Only",
    text: `**Exchange Window:** Items may be exchanged within 14 days of delivery.

**Condition:** Items must be unused, unworn, and in original condition with all tags attached.

**Process:** Contact us within 14 days to request an exchange. Return the original item in its original packaging. Once received and inspected, we'll ship your exchange item.

**Shipping:** Buyer pays return shipping. We'll cover shipping for the replacement item.

**Exchanges Only:** We do not offer refunds, only exchanges for different sizes, colors, or styles.

**Custom Items:** Custom or personalized items cannot be exchanged unless defective.`,
  },
  {
    id: "no-returns-custom",
    name: "No Returns (Custom/Handmade Items)",
    text: `**All Sales Final:** Due to the custom, handmade nature of our products, we do not accept returns or exchanges.

**Quality Guarantee:** We stand behind the quality of our work. If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos. We will work with you to resolve the issue.

**Damaged in Transit:** If your item arrives damaged, please contact us immediately with photos. We will file a claim with the shipping carrier and send you a replacement.

**Questions Before Purchase:** Please contact us with any questions before placing your order. We're happy to provide additional photos, measurements, or information to ensure you're completely satisfied with your purchase.`,
  },
  {
    id: "60-day-store-credit",
    name: "60-Day Returns for Store Credit",
    text: `**Return Window:** Items may be returned within 60 days of delivery for store credit.

**Store Credit:** Returns are accepted for store credit only (no cash refunds). Store credit never expires and can be used for any future purchase.

**Condition:** Items must be in unused, original condition with tags attached.

**Process:** Contact us to initiate a return. Return shipping label may be available for a $5 fee, or you may use your own shipping method. Once we receive and approve the return, store credit will be issued to your account within 3-5 business days.

**Return Shipping:** Buyer is responsible for return shipping costs.

**Exceptions:** Sale items and custom/personalized items are final sale and cannot be returned.`,
  },
  {
    id: "defective-only",
    name: "Defective Items Only",
    text: `**Defective Items:** We will gladly replace or refund any item that arrives defective or damaged.

**Timeframe:** Please contact us within 7 days of receiving your order if you believe your item is defective.

**Process:** Email us with your order number and photos showing the defect or damage. We'll review your request and provide a prepaid return label if needed. Upon receiving the item, we'll issue a replacement or full refund.

**Non-Defective Returns:** We do not accept returns for change of mind, incorrect size/color selection, or other non-defect reasons. Please review product descriptions and measurements carefully before ordering.

**Custom Orders:** Since all items are made to order based on your specifications, returns are only accepted for defective items.`,
  },
];

/**
 * Get a shipping template by ID
 */
export function getShippingTemplate(id: string): PolicyTemplate | undefined {
  return SHIPPING_TEMPLATES.find((template) => template.id === id);
}

/**
 * Get a return template by ID
 */
export function getReturnTemplate(id: string): PolicyTemplate | undefined {
  return RETURN_TEMPLATES.find((template) => template.id === id);
}
