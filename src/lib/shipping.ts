/**
 * Shipping label generation utilities
 * 
 * To enable shipping label generation:
 * 1. Sign up at https://www.easypost.com/
 * 2. Get your API key from the dashboard
 * 3. Install: npm install @easypost/api
 * 4. Add EASYPOST_API_KEY to your .env file
 * 5. Configure return address environment variables
 */

interface ShippingAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

interface ReturnLabelResult {
  success: boolean;
  tracking_number?: string;
  label_url?: string;
  carrier?: string;
  error?: string;
}

/**
 * Check if EasyPost is configured
 */
export function isShippingConfigured(): boolean {
  return !!(
    process.env.EASYPOST_API_KEY &&
    process.env.RETURN_ADDRESS_NAME &&
    process.env.RETURN_ADDRESS_STREET1 &&
    process.env.RETURN_ADDRESS_CITY &&
    process.env.RETURN_ADDRESS_STATE &&
    process.env.RETURN_ADDRESS_ZIP
  );
}

/**
 * Get return address from environment variables
 */
export function getReturnAddress(): ShippingAddress {
  return {
    name: process.env.RETURN_ADDRESS_NAME || "Dude.Box Returns",
    street1: process.env.RETURN_ADDRESS_STREET1 || "",
    street2: process.env.RETURN_ADDRESS_STREET2,
    city: process.env.RETURN_ADDRESS_CITY || "",
    state: process.env.RETURN_ADDRESS_STATE || "",
    zip: process.env.RETURN_ADDRESS_ZIP || "",
    country: process.env.RETURN_ADDRESS_COUNTRY || "US",
    phone: process.env.RETURN_ADDRESS_PHONE,
  };
}

/**
 * Generate a prepaid return shipping label via EasyPost
 * 
 * @param customerAddress - Customer's shipping address
 * @param orderTotal - Order total for insurance purposes
 * @returns Label information including tracking number and PDF URL
 */
export async function generateReturnLabel(
  customerAddress: ShippingAddress,
  orderTotal: number
): Promise<ReturnLabelResult> {
  try {
    // Check if EasyPost is configured
    if (!isShippingConfigured()) {
      console.warn("⚠️ EasyPost not configured. Skipping label generation.");
      return {
        success: false,
        error: "Shipping label generation not configured. Please set up EasyPost API credentials.",
      };
    }

    // Dynamically import EasyPost (only if configured)
    try {
      const EasyPostClient = (await import("@easypost/api")).default;
      const easypost = new EasyPostClient(process.env.EASYPOST_API_KEY!);

      const returnAddress = getReturnAddress();

      // Create shipment with return address as destination (customer sends TO us)
      const shipment = await easypost.Shipment.create({
        to_address: {
          name: returnAddress.name,
          street1: returnAddress.street1,
          street2: returnAddress.street2,
          city: returnAddress.city,
          state: returnAddress.state,
          zip: returnAddress.zip,
          country: returnAddress.country,
          phone: returnAddress.phone,
        },
        from_address: {
          name: customerAddress.name,
          street1: customerAddress.street1,
          street2: customerAddress.street2,
          city: customerAddress.city,
          state: customerAddress.state,
          zip: customerAddress.zip,
          country: customerAddress.country,
          phone: customerAddress.phone,
        },
        parcel: {
          length: 12,
          width: 10,
          height: 6,
          weight: 32, // 2 lbs in ounces
        },
      });

      // Buy the cheapest rate
      if (!shipment.rates || shipment.rates.length === 0) {
        throw new Error("No shipping rates available");
      }

      // Sort by price and select cheapest
      const cheapestRate = shipment.rates.sort(
        (a, b) => parseFloat(a.rate) - parseFloat(b.rate)
      )[0];

      // Buy the label
      const boughtShipment = await easypost.Shipment.buy(
        shipment.id,
        cheapestRate.id
      );

      console.log(`✅ Shipping label generated: ${boughtShipment.tracking_code}`);

      return {
        success: true,
        tracking_number: boughtShipment.tracking_code || undefined,
        label_url: boughtShipment.postage_label?.label_url || undefined,
        carrier: cheapestRate.carrier || undefined,
      };
    } catch (importError) {
      // EasyPost SDK not installed
      console.error("EasyPost SDK not installed:", importError);
      return {
        success: false,
        error: "EasyPost SDK not installed. Run: npm install @easypost/api",
      };
    }
  } catch (error) {
    console.error("Error generating shipping label:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate shipping label",
    };
  }
}

/**
 * Get tracking information for a shipment
 */
export async function getTrackingInfo(trackingNumber: string, carrier: string) {
  try {
    if (!isShippingConfigured()) {
      return null;
    }

    const EasyPostClient = (await import("@easypost/api")).default;
    const easypost = new EasyPostClient(process.env.EASYPOST_API_KEY!);

    const tracker = await easypost.Tracker.create({
      tracking_code: trackingNumber,
      carrier: carrier,
    });

    return tracker;
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    return null;
  }
}

/**
 * Cancel a shipping label (if not yet used)
 */
export async function cancelLabel(shipmentId: string): Promise<boolean> {
  try {
    if (!isShippingConfigured()) {
      return false;
    }

    const EasyPostClient = (await import("@easypost/api")).default;
    const easypost = new EasyPostClient(process.env.EASYPOST_API_KEY!);

    await easypost.Shipment.refund(shipmentId);
    console.log(`✅ Shipping label cancelled: ${shipmentId}`);
    return true;
  } catch (error) {
    console.error("Error cancelling label:", error);
    return false;
  }
}
