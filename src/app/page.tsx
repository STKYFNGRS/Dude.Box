import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Link from 'next/link';
import Image from 'next/image';

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-lg mt-4 text-center">
          <Link href="/" passHref>
        <Image 
          src="/hunt pick 2.png" 
          alt="Image of child picking his nose" 
          width={400} 
          height={100} 
          priority
        />
      </Link></p>
        <Analytics />
      </div>
    </Layout>
  );
}
