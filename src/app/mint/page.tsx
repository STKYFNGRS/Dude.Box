import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-lg mt-4 text-center">Coming Soon</p>
        <Analytics />
      </div>
    </Layout>
  );
}