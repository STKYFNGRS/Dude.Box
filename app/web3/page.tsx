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
  const [address, setAddress] = useState('');

  const handleConnect = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts[0]) {
          setAddress(accounts[0]);
        }
      } else {
        window.open('https://www.coinbase.com/wallet', '_blank');
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setAddress('');
      window.location.reload();
    } catch (error) {
      console.error('Disconnect error:', error);
      setAddress('');
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-3xl mx-auto text-center text-white space-y-8">
            <h1 className="text-4xl font-bold mb-6" style={{ color: '#A020F0' }}>Web3</h1>
            <p className="text-xl leading-relaxed">
              Under Contstruction
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