"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps {
  priceId: string;
  price: string;
  className?: string;
}

export function SubscribeButton({ priceId, price, className }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    // Check if user is logged in
    if (!session) {
      router.push("/portal/login?redirect=/products/subscription-box");
      return;
    }

    setIsLoading(true);

    try {
      // Call our API to create a Stripe Checkout session
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={className || "solid-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] mt-4 w-full text-center"}
    >
      {isLoading ? "Loading..." : "Start Subscription"}
    </button>
  );
}
