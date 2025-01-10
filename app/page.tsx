import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';

export const metadata = {
  description: 'Web3 and ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="pb-16 space-y-8">
        <ThreeItemGrid />
        <Carousel />
      </div>
      <Footer />
      <Analytics/>
      <SpeedInsights/>
    </div>
  );
}