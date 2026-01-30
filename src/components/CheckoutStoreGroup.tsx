"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckoutModal } from "./checkout/CheckoutModal";

interface Item {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: any;
    description: string | null;
  };
}

interface Store {
  id: string;
  name: string;
  subdomain: string;
}

export function CheckoutStoreGroup({
  store,
  items,
  total,
  storeNumber,
  totalStores,
}: {
  store: Store;
  items: Item[];
  total: number;
  storeNumber: number;
  totalStores: number;
}) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = () => {
    setError("");
    // Open embedded checkout modal instead of redirecting
    setShowCheckoutModal(true);
  };

  return (
    <div className="card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {totalStores > 1 && `${storeNumber}. `}
            <Link
              href={`/stores/${store.subdomain}`}
              className="hover:text-primary transition-colors"
            >
              {store.name}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground">
            {store.subdomain}.dude.box
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">${total.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">
            (${(total * 0.9).toFixed(2)} to vendor)
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between pb-3 border-b border-border last:border-0"
          >
            <div className="flex-1">
              <div className="font-medium">{item.product.name}</div>
              {item.product.description && (
                <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {item.product.description}
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                Quantity: {item.quantity}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                $
                {(
                  parseFloat(item.product.price.toString()) * item.quantity
                ).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                ${item.product.price.toString()} each
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        className="solid-button rounded-full px-8 py-3 text-sm w-full font-semibold uppercase tracking-wider shadow-button hover:shadow-glow transition-all"
      >
        Checkout {store.name}
      </button>

      {/* Embedded Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        storeId={store.id}
        storeName={store.name}
        items={items}
        total={total}
      />
    </div>
  );
}
