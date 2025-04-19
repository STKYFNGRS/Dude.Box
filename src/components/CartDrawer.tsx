'use client';

import React, { useRef, useEffect } from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { formatPrice } from '@/utils/shopify';
import Link from 'next/link';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    totalItems,
    subtotal,
    checkout,
    isCheckingOut
  } = useCart();
  
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Close drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isCartOpen) {
        toggleCart();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen, toggleCart]);

  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />
      
      {/* Cart Drawer - Slides in from right */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-black border-l border-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="border-b border-gray-800 p-4 flex justify-between items-center">
            <h2 className="text-accent text-2xl font-bold animate-glitch-text-mini">
              Cart <span className="ml-2 text-white text-sm">({totalItems} items)</span>
            </h2>
            <button 
              onClick={toggleCart}
              className="text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Cart Body */}
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-gray-400 mb-6">Your cart is empty</p>
                <button 
                  onClick={toggleCart}
                  className="px-4 py-2 bg-accent text-white rounded-full hover:bg-opacity-80 transition-all animate-glitch-hover"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <CartItemCard 
                    key={item.id} 
                    item={item} 
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-800 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold">{formatPrice(subtotal.toString())}</span>
              </div>
                <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={clearCart}
                  className="px-4 py-2 border border-accent text-accent text-sm rounded-full hover:bg-accent hover:text-white transition-all"
                >
                  Clear Cart
                </button>
                
                <button 
                  onClick={async () => {
                    try {
                      // Get checkout URL from our new checkout function
                      const checkoutUrl = await checkout();
                      if (checkoutUrl) {
                        // Redirect to Shopify checkout with our cart items
                        window.open(checkoutUrl, '_blank');
                      }
                    } catch (err) {
                      console.error('Checkout failed:', err);
                      alert('Checkout failed. Please try again.');
                    }
                  }}
                  disabled={isCheckingOut}
                  className="px-4 py-2 bg-accent text-white text-sm rounded-full hover:bg-opacity-80 transition-all animate-glitch-hover text-center disabled:opacity-50"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Individual cart item component
function CartItemCard({ 
  item, 
  removeFromCart, 
  updateQuantity 
}: { 
  item: CartItem, 
  removeFromCart: (id: string) => void,
  updateQuantity: (id: string, quantity: number) => void
}) {
  return (
    <div className="card-box rounded-lg p-3 flex gap-3 animate-glitch-hover">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
        <img 
          src={item.image || '/android-chrome-512x512.png'} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-grow">
        <h4 className="text-accent text-sm font-medium line-clamp-2">{item.title}</h4>
        <div className="flex justify-between items-center mt-2">
          <div className="text-white">{formatPrice(item.price)}</div>
          
          <div className="flex items-center">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center text-white">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      {/* Remove Button */}
      <button 
        onClick={() => removeFromCart(item.id)}
        className="text-gray-500 hover:text-red-500 self-start"
        aria-label="Remove item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
