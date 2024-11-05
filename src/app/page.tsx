import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center overflow-hidden p-4">
        <Link href="/" passHref>
          <Image 
            src="/Logo_White.svg"
            alt="Dude Logo"
            width={200} // Adjust width as needed
            height={100} // Adjust height to match visual requirements
            priority
          />
        </Link>
        <p className="text-lg mt-4">Coming Soon</p>
        <Analytics />
      </div>
    </Layout>
  );
}
