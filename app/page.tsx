import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import ViewAllButton from 'components/ui/view-all-button';

export const metadata = {
  description: 'Web3 and ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="flex-grow">
        <div className="space-y-8">
          <ThreeItemGrid />
          <Carousel />
          <ViewAllButton />
        </div>
      </div>
      <Footer />
      <Analytics/>
      <SpeedInsights/>
    </div>
  );
}