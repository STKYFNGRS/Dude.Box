import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { Shield, Users, Lock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const TokenPage = () => {
  return (
    <ClientLayout>
      <div className="relative z-0 pt-24 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        {/* Hero Section with background image */}
        <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src="/hunt pick 2.png"
            alt="Dude Box Background"
            layout="fill"
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600">
              Token Coming Soon, Dude
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Empowering our community through decentralized participation and rewards
            </p>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 py-16">
          {/* Token Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Utility First",
                description:
                  "Our token will serve as the foundation for community engagement, governance, and exclusive access within the Dude Dot Box ecosystem.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Driven",
                description:
                  "Token holders can participate in community decisions, product development, and future initiatives through our governance system.",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Fair Distribution",
                description:
                  "Transparent tokenomics with clear allocation for community rewards, development, and ecosystem growth.",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-gray-800/80 p-8 rounded-xl border border-gray-700 hover:border-blue-500 
                       transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center mb-4 text-blue-400">
                  {card.icon}
                  <h3 className="text-xl font-semibold ml-3">{card.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Token Utility Section */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Token Utility
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-6 text-blue-400">
                  Community Access
                </h3>
                <ul className="space-y-4 text-gray-300">
                  {[
                    "Early access to new product drops",
                    "Exclusive community events and workshops",
                    "Premium Discord channels and content",
                    "Special merchandise collections",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-6 text-blue-400">
                  Governance Rights
                </h3>
                <ul className="space-y-4 text-gray-300">
                  {[
                    "Participate in product development decisions",
                    "Vote on community initiatives",
                    "Propose new features and collaborations",
                    "Help shape the future of Dude Box",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Token Distribution */}
          <div className="mb-24">
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Token Distribution
            </h2>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-blue-400">
                    Initial Allocation
                  </h3>
                  <ul className="space-y-4 text-gray-300">
                    {[
                      ["Community Rewards", "40%"],
                      ["Development Fund", "20%"],
                      ["Ecosystem Growth", "20%"],
                      ["Team", "10%"],
                      ["Treasury", "10%"],
                    ].map(([label, value], index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{label}</span>
                        <span className="font-semibold text-blue-400">
                          {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-blue-400">
                    Vesting Schedule
                  </h3>
                  <ul className="space-y-4 text-gray-300">
                    {[
                      "Team tokens: 2-year linear vesting",
                      "Development Fund: 3-year release schedule",
                      "Community rewards: Released based on milestones",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center max-w-3xl mx-auto">
            <p className="text-gray-300 mb-4">
              This information is provided for informational purposes only and
              does not constitute financial advice. Tokens are utility
              tokens intended for platform participation and governance.
            </p>
            <p className="text-gray-400">
              Always conduct your own research and consult with qualified
              professionals before making any decisions.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </ClientLayout>
  );
};

export default TokenPage;
