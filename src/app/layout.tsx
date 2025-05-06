import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Providers from "@/context/Providers";
import CartDrawer from "@/components/CartDrawer";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { wagmiAdapter } from "@/config/reownAppKitConfig";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dude Box | Robot Foundry, Smart Collectibles & DIY Kits",
  description: "Build, collect, and connect with Dude — home of handmade robotic smart lamps, DIY kits, and tech-powered collectibles. Disabled Veteran-owned. Story-driven. Maker-built.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, headers().get("cookie"));

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
