"use client";

import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";

export function StripeConnectOnboarding() {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const initializeStripeConnect = async () => {
      try {
        // Fetch Account Session from backend
        const response = await fetch("/api/vendor/stripe-connect-session", {
          method: "POST",
        });
        
        if (!response.ok) {
          throw new Error("Failed to create Connect session");
        }
        
        const { clientSecret } = await response.json();
        
        // Initialize Connect.js
        const instance = await loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret: async () => clientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#00d4ff", // Dude.Box accent color
              colorBackground: "#0f1628",
              colorText: "#e0e7ff",
              fontFamily: "system-ui, sans-serif",
            },
          },
        });
        
        setStripeConnectInstance(instance);
        setLoading(false);
      } catch (err) {
        console.error("Stripe Connect initialization error:", err);
        setError("Failed to load Stripe Connect. Please try again.");
        setLoading(false);
      }
    };
    
    initializeStripeConnect();
  }, []);
  
  if (loading) {
    return (
      <div className="card rounded-lg p-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Stripe Connect...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card rounded-lg p-6 border-error/20">
        <p className="text-error">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="outline-button rounded-full px-4 py-2 text-sm mt-4"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="card rounded-lg overflow-hidden">
      <stripe-connect-account-onboarding
        // @ts-ignore - Custom element from Stripe
        stripe={stripeConnectInstance}
        onExit={() => {
          // Handle user exiting the flow
          console.log("User exited onboarding");
        }}
        onComplete={() => {
          // Verify completion and redirect
          console.log("Onboarding completed");
          window.location.href = "/vendor/settings?stripe=connected";
        }}
      />
    </div>
  );
}
