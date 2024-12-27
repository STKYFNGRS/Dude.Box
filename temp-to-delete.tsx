import { CartProvider } from 'components/cart/cart-context';
import { GeistSans } from 'geist/font/sans';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import { getCart } from 'lib/shopify';

export default async function Web3RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  const cart = getCart(cartId);

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-black text-white">
        <CartProvider cartPromise={cart}>
          {children}
          <Toaster closeButton />
        </CartProvider>
      </body>
    </html>
  );
}