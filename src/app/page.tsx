import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Link href="/" passHref>
          <Image  src="/Dude logo 3.jpg" // Path to your logo image
            alt="Dude Logo"
            width={200} // Base width to satisfy Next.js requirements
            height={100} // Base height to satisfy Next.js requirements
            priority  />
        </Link>
        <p className="text-lg mt-4 text-center">Coming Soon</p>
        <Analytics />
      </div>
    </Layout>
  );
}
