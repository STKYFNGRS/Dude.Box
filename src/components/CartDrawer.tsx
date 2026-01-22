"use client";

import { useEffect, useState } from "react";
import { readCartAttributes, writeCartAttributes } from "@/lib/cart";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const attributes = readCartAttributes();
    setIsGift(Boolean(attributes.isGift));
    setGiftNote(attributes.giftNote ?? "");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    writeCartAttributes({ isGift, giftNote });
  }, [giftNote, isGift, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart drawer"
        onClick={onClose}
        className="absolute inset-0 bg-background/70"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-background p-6 flex flex-col">
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
          <div className="card rounded-lg p-4">
            <div className="text-xs uppercase tracking-[0.3em] muted">Your drop</div>
            <div className="section-title text-lg pt-2">Monthly Subscription</div>
            <div className="text-sm muted pt-1">$59.99 / month</div>
          </div>

          <div className="card rounded-lg p-4 flex flex-col gap-3">
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
          <button className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full">
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
