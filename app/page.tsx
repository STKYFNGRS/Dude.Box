import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <div className="space-y-8 mt-8 container mx-auto px-4">
          <ThreeItemGrid />
          <Carousel />
          <ViewAllButton />
          
          {/* About Section Content */}
          <div className="py-16">
            <MissionStatement />
            <ServicesGrid />
            <FounderSection />
            <StatisticsSection />
            <CallToAction />
          </div>
        </div>
      </div>
      <Footer />
      <Analytics/>
      <SpeedInsights/>
    </div>
  );
}