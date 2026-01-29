"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: any;
  };
  store: {
    id: string;
    name: string;
    subdomain: string;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (!isOpen) return null;

  // Group items by store
  const itemsByStore: { [storeId: string]: CartItem[] } = {};
  cart?.items.forEach((item) => {
    if (!itemsByStore[item.store.id]) {
      itemsByStore[item.store.id] = [];
    }
    itemsByStore[item.store.id].push(item);
  });

  const stores = Object.keys(itemsByStore);
  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  // Calculate totals
  let grossTotal = 0;
  cart?.items.forEach((item) => {
    grossTotal += parseFloat(item.product.price.toString()) * item.quantity;
  });
  
  const platformFee = grossTotal * 0.01; // 1% fee
  const grandTotal = grossTotal;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-card-hover animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-6">
              {stores.map((storeId) => {
                const storeItems = itemsByStore[storeId];
                const store = storeItems[0].store;
                const storeTotal = storeItems.reduce(
                  (sum, item) =>
                    sum + parseFloat(item.product.price.toString()) * item.quantity,
                  0
                );

                return (
                  <div key={storeId} className="card rounded-lg p-4">
                    <div className="font-semibold mb-3 flex items-center justify-between">
                      <Link
                        href={`/stores/${store.subdomain}`}
                        className="hover:text-primary transition-colors"
                      >
                        {store.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        ${storeTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {storeItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${item.product.price.toString()} x {item.quantity}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${grossTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee (1%)</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {stores.length > 1 && (
              <div className="text-xs text-muted-foreground bg-blue-500/10 p-3 rounded">
                You're buying from {stores.length} different stores. You'll
                complete checkout for each store separately.
              </div>
            )}

            <Link
              href="/cart/checkout"
              className="solid-button rounded-full px-8 py-3 text-sm w-full block text-center"
              onClick={onClose}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
