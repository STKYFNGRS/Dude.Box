'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function CartIcon() {
  const { toggleCart, totalItems } = useCart();
  
  return (
    <button 
      onClick={toggleCart} 
      className="relative p-2 text-white hover:text-accent transition-colors"
      aria-label="Shopping Cart"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
      </svg>
      
      {/* Item count badge */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-black text-xs w-5 h-5 flex items-center justify-center rounded-full animate-glitch-hover">
          {totalItems}
        </span>
      )}
    </button>
  );
}
