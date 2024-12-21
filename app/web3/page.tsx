import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";

import Footer from '../../components/layout/footer';

export const metadata = {
  description: 'About DUDE.BOX - Building community and supporting mental health through innovative web3 solutions.',
  openGraph: {
    type: 'website'
  }
};

export default function Web3Page() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-3xl mx-auto text-center text-white space-y-8">
            <h1 className="text-4xl font-bold mb-6">Web3</h1>
            <p className="text-xl leading-relaxed">
              Welcome to the future, dude.
            </p>
          </div>
        </main>
        <Footer />
        <Analytics/>
        <SpeedInsights/>
      </div>
    </>
  );
}