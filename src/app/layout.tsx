import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Providers from "@/context/Providers";
import CartDrawer from "@/components/CartDrawer";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { wagmiAdapter } from "@/config/reownAppKitConfig";

// Force dynamic rendering to allow headers() usage
export const dynamic = 'force-dynamic';

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dude Box | Robot Foundry, Smart Collectibles & Adventures of Little Dude",
  description: "Build, collect, and connect with Dude — home of handmade robots, smart lamps and other tech-powered collectibles. Disabled Veteran-owned. Story-driven. Maker-built.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Disable automatic reconnection by not passing any initial state from cookies
  // This prevents the wallet from automatically connecting on page load
  const initialState = undefined;

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceCodePro.variable} antialiased`}
      >
        <Providers initialState={initialState}>
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
