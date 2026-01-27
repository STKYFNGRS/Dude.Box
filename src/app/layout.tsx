import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/Providers";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700", "900"],
});

export const metadata: Metadata = {
  title: "dude.box | Veteran-Owned Subscription Box",
  description:
    "Premium EDC gear, tools, and grooming supplies sourced from veteran-owned small businesses.",
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
