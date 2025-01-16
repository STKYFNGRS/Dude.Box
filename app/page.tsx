import NotSeenIn from 'components/not-seen-in';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import BottomCTA from 'components/layout/bottom-cta';
import CallToAction from 'components/layout/call-to-action';
import Footer from 'components/layout/footer';
import FounderSection from 'components/layout/founder-section';
import HeroSection from 'components/layout/hero-section';
import MissionStatement from 'components/layout/mission-statement';
import ServicesGrid from 'components/layout/services-grid';
import StatisticsSection from 'components/layout/statistics-section';
import ViewAllButton from 'components/ui/view-all-button';

export const metadata = {
  description: 'Web3 and ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Global Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <NotSeenIn />
        <div className="space-y-8 mt-8">
          <div className="w-full">
            <ThreeItemGrid />
          </div>
          <div className="container mx-auto px-4">
            <Carousel />
            <ViewAllButton />
            
            {/* About Section Content */}
            <div className="py-16">
              <MissionStatement />
              <ServicesGrid />
              <FounderSection />
              <StatisticsSection />
              <CallToAction />
              <BottomCTA />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Analytics/>
      <SpeedInsights/>
    </div>
  );
}