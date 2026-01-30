"use client";

import { useEffect } from "react";
import { EmbeddedCheckout } from "./EmbeddedCheckout";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  storeName: string;
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: any;
      description: string | null;
    };
  }>;
  total: number;
}

export function CheckoutModal({
  isOpen,
  onClose,
  storeId,
  storeName,
  items,
  total,
}: CheckoutModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    // Payment will redirect to thank-you page via Stripe
    // Modal will close automatically on redirect
  };

  const handleError = (error: string) => {
    console.error("Checkout error:", error);
    // Error is displayed in the form, modal stays open
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 bg-background rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Secure Checkout</h2>
              <p className="text-sm text-muted-foreground">
                {storeName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/10"
              aria-label="Close checkout"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Order Items Summary */}
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex-1">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-muted-foreground ml-2">
                      × {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium">
                    ${(parseFloat(item.product.price.toString()) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] p-6">
          <EmbeddedCheckout
            storeId={storeId}
            storeName={storeName}
            items={items}
            total={total}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Secure SSL Encryption</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 2h12v2H6V8zm0 4h8v2H6v-2z" />
              </svg>
              <span>PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
