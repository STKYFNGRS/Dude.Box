"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CartLine = {
  id: string;
  quantity: number;
  merchandise?: {
    title: string;
    product?: { title: string; handle: string };
    price?: { amount: string; currencyCode: string };
  };
};

type CartState = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost?: {
    subtotalAmount?: { amount: string; currencyCode: string };
    totalAmount?: { amount: string; currencyCode: string };
  };
  lines?: { nodes: CartLine[] };
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [cart, setCart] = useState<CartState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAssociatedCustomer, setHasAssociatedCustomer] = useState(false);
  const { data: session } = useSession();
  const emitCartUpdate = (updatedCart: CartState | null) => {
    window.dispatchEvent(
      new CustomEvent("cart:updated", {
        detail: { totalQuantity: updatedCart?.totalQuantity ?? 0 },
      })
    );
  };
  const updateLineQuantity = async (lineId: string, nextQuantity: number) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      if (nextQuantity <= 0) {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "removeLines", lineIds: [lineId] }),
        });
        if (!response.ok) {
          throw new Error("Unable to update cart.");
        }
        const payload = await response.json();
        setCart(payload.cart ?? null);
        emitCartUpdate(payload.cart ?? null);
        return;
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateLines", lines: [{ id: lineId, quantity: nextQuantity }] }),
      });
      if (!response.ok) {
        throw new Error("Unable to update cart.");
      }
      const payload = await response.json();
      setCart(payload.cart ?? null);
      emitCartUpdate(payload.cart ?? null);
    } catch (error) {
      setErrorMessage("Unable to update cart.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    fetch("/api/cart", { method: "GET" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load cart.");
        }
        return response.json();
      })
      .then((payload) => {
        const nextCart = payload.cart ?? null;
        setCart(nextCart);
        emitCartUpdate(nextCart);
      })
      .catch(() => {
        setErrorMessage("Unable to load cart.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const customerAccessToken = (session as { customerAccessToken?: string })
      ?.customerAccessToken;
    if (!customerAccessToken || hasAssociatedCustomer) {
      return;
    }

    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "associateCustomer", customerAccessToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to associate customer.");
        }
        return response.json();
      })
      .then((payload) => {
        if (payload.cart) {
          setCart(payload.cart);
          emitCartUpdate(payload.cart);
        }
        setHasAssociatedCustomer(true);
      })
      .catch(() => {
        setHasAssociatedCustomer(false);
      });
  }, [hasAssociatedCustomer, isOpen, session]);

  const cartLines = useMemo(() => cart?.lines?.nodes ?? [], [cart]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart drawer"
        onClick={onClose}
        className="absolute inset-0 bg-background/80"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-panel shadow-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <span className="text-xs uppercase tracking-[0.3em] muted">Cart</span>
          <button
            type="button"
            onClick={onClose}
            className="outline-button rounded px-3 py-2 text-xs uppercase tracking-[0.25em]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-6 pt-6">
          <div className="card rounded-lg p-4 bg-background/40">
            <div className="text-xs uppercase tracking-[0.3em] muted">Your drop</div>
            {isLoading ? (
              <div className="text-sm muted pt-3">Loading cart…</div>
            ) : errorMessage ? (
              <div className="text-sm text-accent pt-3">{errorMessage}</div>
            ) : cartLines.length ? (
              <div className="pt-3 flex flex-col gap-3">
                {cartLines.map((line) => (
                  <div key={line.id} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm">
                        {line.merchandise?.product?.title ?? "Subscription"}
                      </div>
                      <div className="text-xs muted">
                        {line.merchandise?.title ?? "Monthly Subscription"}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateLineQuantity(line.id, line.quantity - 1)}
                          className="outline-button rounded px-2 py-1 text-xs uppercase tracking-[0.2em]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="text-xs muted">Qty {line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateLineQuantity(line.id, line.quantity + 1)}
                          className="outline-button rounded px-2 py-1 text-xs uppercase tracking-[0.2em]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => updateLineQuantity(line.id, 0)}
                          className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-foreground">
                      {line.merchandise?.price
                        ? `${Number(line.merchandise.price.amount).toFixed(2)} ${
                            line.merchandise.price.currencyCode
                          }`
                        : ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm muted pt-3">Your cart is empty.</div>
            )}
          </div>

          <div className="card rounded-lg p-4 flex flex-col gap-3 bg-background/40">
            <label className="inline-flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={isGift}
                onChange={(event) => setIsGift(event.target.checked)}
              />
              Is this a gift?
            </label>
            {isGift ? (
              <label className="text-xs uppercase tracking-[0.2em] muted">
                Gift note
                <textarea
                  className="mt-2 w-full min-h-[120px] bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                  value={giftNote}
                  onChange={(event) => setGiftNote(event.target.value)}
                  placeholder="Write a short note for the recipient."
                />
              </label>
            ) : null}
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <button
            className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full"
            type="button"
            onClick={async () => {
              try {
                if (!cart || !cart.totalQuantity) {
                  window.location.href = "/shop";
                  return;
                }
                setIsLoading(true);
                const response = await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "getCheckoutUrl" }),
                });
                if (!response.ok) {
                  throw new Error("Unable to start checkout.");
                }
                const payload = await response.json();
                if (payload.checkoutUrl) {
                  window.location.href = payload.checkoutUrl;
                }
              } catch (error) {
                setErrorMessage("Unable to start checkout.");
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
