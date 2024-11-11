import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from '@/components/CartContext';
import { Toaster } from "@/components/ui/toaster";

console.log('Shopify configuration:', {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  hasToken: !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
});

export const metadata: Metadata = {
  title: "Dude",
  description: "Dude",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
        {children}
        <Toaster />
        <SpeedInsights/>
        </CartProvider>
      </body>
    </html>
  );
}
