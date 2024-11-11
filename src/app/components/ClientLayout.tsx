'use client';

import { Providers } from '@/app/providers';
import { CartProvider } from '@/app/components/CartContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-black">
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Providers>
  );
}