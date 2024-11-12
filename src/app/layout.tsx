import '@/app/globals.css';
import { Providers } from '@/app/providers';
import { CartProvider } from '@/app/components/CartContext';
import { ClientLayout } from '@/app/components/Client-Layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning={true}>
        <Providers>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}