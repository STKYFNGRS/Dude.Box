'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { CartProvider } from './CartContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}