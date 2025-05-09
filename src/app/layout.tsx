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
  // For mobile compatibility, we'll make initialState completely optional
  // This prevents 400 errors that might occur with cookie handling on mobile browsers
  let initialState = undefined;
  
  // Only attempt to get initialState in non-mobile contexts to avoid potential issues
  // This is a simplified approach - the client-side initialization will handle state properly
  try {
    // Simple attempt to detect mobile via user-agent (server-side approach)
    const userAgent = headers().get("user-agent") || "";
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Skip initialState on mobile devices to avoid 400 errors
    if (!isMobileUserAgent) {
      const cookieHeader = headers().get("cookie");
      if (cookieHeader) {
        initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookieHeader);
      }
    }
  } catch (error) {
    console.error("Error handling initial state:", error);
    // Continue without initialState on any error
    initialState = undefined;
  }

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
