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
            dude.box is more than just a men&apos;s brand; it&apos;s a movement. We believe that every man deserves to feel seen, understood, and supported, not just in his personal life but in the world around him. That&apos;s why we&apos;re committed to making a positive impact on men&apos;s mental health through every piece we create. From casual essentials to statement pieces, dude.box is designed to empower men to feel comfortable, confident, and ready to tackle whatever life throws at them.
          </p>
          
          {/* Mission Statement */}
          <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
          <p className="text-lg">
            To design stylish and fun products for men while raising awareness and generating support for mental health initiatives. At dude.box, we aim to spark conversations, break down stigmas, and make meaningful contributions to the mental health community with every item we sell.
          </p>

          {/* From the founder */}
          <h3 className="text-2xl font-semibold mt-6 mb-2">From the founder</h3>
          <p className="text-lg mb-4">
            Welcome to dude.box. I&apos;m just a regular dude, husband, dad, vet who&apos;s been around long enough to know that life doesn&apos;t pull its punches. I&apos;m not here to sell you some polished fairy tale. I&apos;m building this brand from the ground up, not because I needed another hobby, but because I saw a gap, a need, hell, a crisis, and can&apos;t sit on the sidelines anymore.
          </p>
          <p className="text-lg mb-4">
            I know what it&apos;s like to feel like you&apos;re facing the world alone, with all its noise and chaos, and maybe that&apos;s why Dude isn&apos;t just another brand to me. It&apos;s a vehicle, a lifeline, a way to carve out a space for the real conversations men aren&apos;t having. Every sale, every piece we make, is a step toward something bigger: a space in San Diego, California where men can walk in, breathe out, and shed the armor. An office for free one-on-one counseling, group sessions, AA meetings, or just a change of clothes and a haircut, whatever it takes to help another guy keep going.
          </p>
          <p className="text-lg">
            So here&apos;s the deal. Buy our stuff if you like it. Wear it if it feels right. But know that every dollar you spend here pushes us closer to a place where men—guys just like me, just like you—can find a little bit of solid ground in a world that loves to keep us off-balance.
          </p>
        </div>
        
        <Analytics />
      </div>
    </Layout>
  );
}
