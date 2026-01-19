import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/Providers";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "dude.box | Veteran-Owned Men’s Recovery & Social Club",
  description:
    "Veteran-owned men’s recovery & social club in San Diego. Investor-grade overview, disciplined operations, and capped membership.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-background text-foreground">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
