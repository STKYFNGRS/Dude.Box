"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  storeId: string;
  storeName: string;
  items: Array<{ productId: string; quantity: number; product: any }>;
  total: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ storeId, storeName, items, total, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Confirm payment with Stripe
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
        },
      });

      if (submitError) {
        const errorMessage = submitError.message || "Payment failed";
        setError(errorMessage);
        onError(errorMessage);
        setLoading(false);
      } else {
        // Payment succeeded - redirect handled by Stripe
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Something went wrong";
      setError(errorMessage);
      onError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="card rounded-lg p-4">
          <AddressElement
            options={{
              mode: "shipping",
              allowedCountries: ["US", "CA"],
            }}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <div className="card rounded-lg p-4">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm">
          <strong>Payment Error:</strong> {error}
        </div>
      )}

      {/* Order Summary */}
      <div className="card rounded-lg p-4 bg-accent/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-sm font-medium">${total.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Platform Fee (1%)</span>
          <span className="text-sm font-medium">${(total * 0.01).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">${total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          ${(total * 0.99).toFixed(2)} goes to {storeName}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="solid-button rounded-full px-8 py-4 text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed font-semibold uppercase tracking-wider shadow-button hover:shadow-glow transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Secured by Stripe
      </div>
    </form>
  );
}

interface EmbeddedCheckoutProps {
  storeId: string;
  storeName: string;
  items: Array<{ productId: string; quantity: number; product: any }>;
  total: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function EmbeddedCheckout({
  storeId,
  storeName,
  items,
  total,
  onSuccess,
  onError,
}: EmbeddedCheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Create PaymentIntent on component mount
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/checkout/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId,
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create payment");
        }

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to initialize checkout";
        setError(errorMessage);
        onError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [storeId, items, onError]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="animate-spin h-12 w-12 text-primary mb-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-muted-foreground">Loading secure payment form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-lg text-center">
        <svg
          className="w-12 h-12 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="font-semibold mb-2">Failed to Initialize Checkout</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#3b82f6",
      colorBackground: "#1a1a1a",
      colorText: "#ffffff",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      borderRadius: "8px",
    },
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
      }}
    >
      <CheckoutForm
        storeId={storeId}
        storeName={storeName}
        items={items}
        total={total}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
