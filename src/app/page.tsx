import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout" ;

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <p className="text-lg">
          Coming Soon
        </p>
        <Analytics/>
      </div>    
    </Layout>
  );
}