"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export function CartSync() {
  const { data: session, status } = useSession();
  const hasAssociated = useRef(false);

  useEffect(() => {
    // Only run once when authenticated
    if (status !== "authenticated" || hasAssociated.current) {
      return;
    }

    const customerAccessToken = (session as { customerAccessToken?: string })
      ?.customerAccessToken;

    if (!customerAccessToken) {
      return;
    }

    // Associate customer with cart immediately
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "associateCustomer", customerAccessToken }),
    })
      .then(async (response) => {
        if (response.ok) {
          hasAssociated.current = true;
          // Trigger cart update event for other components
          window.dispatchEvent(new CustomEvent("cart:updated"));
        }
      })
      .catch((error) => {
        console.error("Failed to associate customer with cart:", error);
      });
  }, [session, status]);

  useEffect(() => {
    // Reset on logout
    if (status === "unauthenticated") {
      hasAssociated.current = false;
    }
  }, [status]);

  // Listen for login events
  useEffect(() => {
    const handleUserLogin = () => {
      hasAssociated.current = false; // Reset flag to force re-association
    };

    window.addEventListener("user:login", handleUserLogin);
    return () => window.removeEventListener("user:login", handleUserLogin);
  }, []);

  return null; // This component doesn't render anything
}
