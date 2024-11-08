"use client";

import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";

export default function Shop() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="w-full max-w-2xl p-4">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 text-center">
            <h1 className="text-3xl font-bold mb-4">Shop Opening Soon</h1>
            <p className="text-lg text-gray-200 mb-4">
              We&apos;re putting the finishing touches on our collection of products
              that combine style with purpose.
            </p>
            <div className="text-gray-400">
              Each purchase will support mental health initiatives
            </div>
          </div>
        </div>
        <Analytics />
      </div>
    </Layout>
  );
}
