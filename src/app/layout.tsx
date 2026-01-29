import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/Providers";
import { authOptions } from "@/lib/auth";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700", "900"],
});

export const metadata: Metadata = {
  title: "dude.box | Marketplace for Makers",
  description:
    "A marketplace where skilled craftsmen sell quality products. Get your own storefront, connect your payment account, and reach customers who value craftsmanship.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#0f1628',
};

// Force dynamic rendering to prevent caching of auth state
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch server session to pass to client
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-background text-foreground">
        <Providers session={session}>
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
