// src/app/providers.tsx
'use client';

import { CartProvider } from '@/app/components/CartContext';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
}