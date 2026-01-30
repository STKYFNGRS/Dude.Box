"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface VendorApplicationData {
  subdomain: string;
  name: string;
  description: string;
  contact_email: string;
}

interface CheckoutFormProps {
  applicationData: VendorApplicationData;
  applicationFee: { amount: number; name: string };
  monthlySubscription: { amount: number; name: string };
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({
  applicationData,
  applicationFee,
  monthlySubscription,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      console.log("🔵 Starting payment confirmation...");
      
      // Confirm the SetupIntent
      const { error: submitError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.origin, // Not used, but required
        },
        redirect: "if_required", // Stay on page
      });

      if (submitError) {
        console.error("❌ Setup confirmation error:", submitError);
        onError(submitError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (!setupIntent || setupIntent.status !== "succeeded") {
        console.error("❌ SetupIntent not succeeded:", setupIntent);
        onError("Payment method confirmation failed");
        setIsProcessing(false);
        return;
      }

      console.log("✅ SetupIntent confirmed:", setupIntent.id);
      console.log("🔵 Calling confirm-application API...");

      // Call our API to process the application (charge fee + create subscription + create store)
      const response = await fetch("/api/vendor/confirm-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setupIntentId: setupIntent.id,
        }),
      });

      console.log("🔵 API Response status:", response.status);
      const data = await response.json();
      console.log("🔵 API Response data:", data);

      if (!response.ok) {
        console.error("❌ API Error:", data);
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || "Failed to process application";
        throw new Error(errorMessage);
      }

      console.log("✅ Application processed successfully!");
      setIsProcessing(false);
      onSuccess();
    } catch (err) {
      console.error("❌ Exception in handleSubmit:", err);
      onError(err instanceof Error ? err.message : "An error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-panel border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted">{applicationFee.name}</span>
            <span className="font-medium text-foreground">${applicationFee.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">{monthlySubscription.name}</span>
            <span className="font-medium text-foreground">${monthlySubscription.amount.toFixed(2)}/mo</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between items-center font-semibold">
            <span className="text-foreground">Due Today</span>
            <span className="text-accent text-lg">
              ${(applicationFee.amount + monthlySubscription.amount).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted pt-1">
            Then ${monthlySubscription.amount.toFixed(2)}/month starting next month
          </p>
        </div>
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Payment Information</h3>
        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                address: {
                  country: "auto",
                },
              },
            },
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="solid-button rounded-full px-8 py-3 text-sm w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            Processing Payment...
          </span>
        ) : (
          `Complete Application - $${(applicationFee.amount + monthlySubscription.amount).toFixed(2)}`
        )}
      </button>

      <p className="text-xs text-muted text-center">
        Your payment information is securely processed by Stripe. We never store your card details.
      </p>
    </form>
  );
}

interface VendorApplicationCheckoutProps {
  applicationData: VendorApplicationData;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function VendorApplicationCheckout({
  applicationData,
  onSuccess,
  onError,
}: VendorApplicationCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [applicationFee, setApplicationFee] = useState<{ amount: number; name: string } | null>(null);
  const [monthlySubscription, setMonthlySubscription] = useState<{ amount: number; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create SetupIntent when component mounts
    async function createSetupIntent() {
      try {
        const response = await fetch("/api/vendor/create-setup-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(applicationData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to initialize payment");
        }

        setClientSecret(data.clientSecret);
        setApplicationFee(data.applicationFee);
        setMonthlySubscription(data.monthlySubscription);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    }

    createSetupIntent();
  }, [applicationData, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret || !applicationFee || !monthlySubscription) {
    return (
      <div className="bg-error/10 text-error border border-error/20 p-4 rounded-lg text-sm">
        Failed to initialize payment. Please try again.
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#dc143c",
            colorBackground: "#0f1419",
            colorText: "#e6edf3",
            colorDanger: "#dc143c",
            fontFamily: "system-ui, -apple-system, sans-serif",
            spacingUnit: "4px",
            borderRadius: "8px",
          },
        },
      }}
    >
      <CheckoutForm
        applicationData={applicationData}
        applicationFee={applicationFee}
        monthlySubscription={monthlySubscription}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
