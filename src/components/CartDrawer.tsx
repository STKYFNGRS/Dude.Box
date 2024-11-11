'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from './CartContext';
import Image from "next/image";
import { useState } from "react";

export function CartDrawer() {
  const { items, total, removeFromCart, updateQuantity, isLoading } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button 
          className="relative p-2 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-gray-900 text-white border-l border-gray-700">
        <SheetHeader>
          <SheetTitle className="text-white">Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-400">Your cart is empty</p>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-gray-700">
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="p-1 hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                        disabled={isLoading}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="p-1 hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                        disabled={isLoading}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-red-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
                        onClick={() => removeFromCart(item.variantId)}
                        disabled={isLoading}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-4 space-y-4">
                <div className="flex justify-between text-white">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                  aria-label="Proceed to checkout"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}