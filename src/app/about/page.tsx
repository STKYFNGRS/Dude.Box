"use client"; // Ensure this component is client-side for useState

import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";


export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4">
        {/* About Us Section */}
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">About dude.box</h1>
          <p className="text-lg mb-4">
            Dude.box is more than just a men&apos;s clothing brand; it&apos;s a movement. We believe that every man deserves to feel seen, understood, and supported, not just in his personal life but in the world around him. That&apos;s why we&apos;re committed to making a positive impact on men&apos;s mental health through every piece we create. From casual essentials to statement pieces, Dude.box is designed to empower men to feel comfortable, confident, and ready to tackle whatever life throws at them.
          </p>
          
          {/* Mission Statement */}
          <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
          <p className="text-lg">
            To design quality, stylish clothing for men while raising awareness and generating support for mental health initiatives. At dude.box, we aim to spark conversations, break down stigmas, and make meaningful contributions to the mental health community with every item we sell.
          </p>
        </div>
        
        <Analytics />
      </div>
    </Layout>
  );
}
