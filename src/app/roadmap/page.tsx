"use client";

import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";
import { ArrowRight, Store, ShoppingBag, Users, Landmark } from "lucide-react";

export default function Roadmap() {
  const phases = [
    {
      title: "Phase 1: Online Foundation (Current)",
      items: [
        "Launch core product line focusing on quality basics",
        "Build initial community through social media and content",
        "Establish brand identity and mission awareness",
        "Target: $500K in first-year revenue"
      ]
    },
    {
      title: "Phase 2: Community Building",
      items: [
        "Launch dude.box NFT Collection - Community Access Passes",
        "Yet to be determined amount of unique NFTs representing founding community members",
        "NFT holders get early access to products and events",
        "Exclusive merchandise drops for community members",
        "Community input on future product lines"
      ]
    },
    {
      title: "Phase 3: Revenue Generation",
      items: [
        "Expand product lines based on community feedback",
        "Announce retail partnerships",
        "Launch subscription box service",
        "Develop partnerships with mental health professionals",
        "Target: $2M in annual revenue"
      ]
    },
    {
      title: "Phase 4: Location Planning",
      items: [
        "Site selection and market analysis",
        "Architectural planning and design",
        "Local community engagement",
        "Initial staff recruitment and training"
      ]
    }
  ];

  const pathOptions = [
    {
      title: "Property Acquisition Path",
      steps: [
        "Target: $1.5M for initial location",
        "Down payment: $300K (20%)",
        "Monthly mortgage: ~$8K",
        "Build-out costs: $400K",
        "Initial operating capital: $300K",
        "Total needed: $1M liquid + mortgage"
      ],
      pros: [
        "Build equity over time",
        "Full control over property",
        "Potential appreciation",
        "Tax benefits"
      ],
      cons: [
        "Higher initial capital needed",
        "Property maintenance responsibility",
        "Less flexibility for location changes",
        "Higher risk"
      ]
    },
    {
      title: "Leasing Path",
      steps: [
        "Target: 3,500-5,000 sq ft space",
        "Lease: $25-35 per sq ft annually",
        "Security deposit: 3-6 months rent",
        "Build-out costs: $400K",
        "Initial operating capital: $300K",
        "Total needed: $800K liquid"
      ],
      pros: [
        "Lower initial capital requirement",
        "More location flexibility",
        "Reduced maintenance responsibility",
        "Faster deployment possible"
      ],
      cons: [
        "No equity building",
        "Subject to rent increases",
        "Less control over property",
        "Potential lease non-renewal"
      ]
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900 text-white min-h-screen">
        <div className="max-w-4xl w-full">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Our Journey Forward
            </h1>
            <p className="text-xl text-gray-200">
              From online community to physical spaces where dudes can find support, 
              connection, and purpose.
            </p>
          </div>

          {/* Phases */}
          <div className="space-y-8 mb-16">
            {phases.map((phase, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
                <h2 className="text-2xl font-semibold mb-4">{phase.title}</h2>
                <ul className="space-y-2">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-gray-200">
                      <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* NFT Information */}
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800 mb-16">
            <h2 className="text-2xl font-semibold mb-6">Community Access Pass NFTs</h2>
            <div className="text-gray-200 space-y-4">
              <p>
                Our NFTs represent membership in the founding community of dude.box. 
                Each unique NFT provides:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Access to exclusive community events and content</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Early access to product drops and collaborations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  <span>Input on future product lines and community initiatives</span>
                </li>
              </ul>
              <p className="text-sm mt-6">
                Note: NFTs are intended for community access and engagement only. They do not represent 
                any ownership in dude.box or entitle holders to any profits or returns.
              </p>
            </div>
          </div>

          {/* Location Strategy */}
          <h2 className="text-3xl font-semibold mb-8 text-center">Our Physical Home</h2>
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800 mb-16">
            <div className="space-y-8">
              {/* Vision Overview */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Mixed-Use Community Hub</h3>
                <p className="text-gray-200 mb-6">
                  Our vision centers on acquiring a 10,000 sq ft property that will serve
                  as more than just a retail space - it will be the physical embodiment of our
                  mission to support and strengthen our community while housing our operations.
                </p>
              </div>

              {/* Space Allocation */}
              <div>
                <h4 className="text-xl font-semibold mb-3">Thoughtful Space Design</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-200">Community & Retail Spaces</h5>
                    <ul className="space-y-2 text-gray-200">
                      <li className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>Premium retail experience (2,000 sq ft)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>Social lounge with coffee & mocktail bar</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Entertainment area with pool tables and gaming stations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Private counseling spaces</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Multi-purpose event venue (1,500 sq ft)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Community meeting rooms</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-200">Operations Hub</h5>
                    <ul className="space-y-2 text-gray-200">
                      <li className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>Product design studio (1,500 sq ft)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>Warehouse and fulfillment center (2,000 sq ft)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>Shipping and receiving area (500 sq ft)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Community Impact */}
              <div>
                <h4 className="text-xl font-semibold mb-3">Impact Through Ownership</h4>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="bg-gray-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-200">Financial Sustainability</h5>
                    <p className="text-sm text-gray-300">
                      Property ownership creates long-term equity and financial stability,
                      allowing us to invest more in our community programs.
                    </p>
                  </li>
                  <li className="bg-gray-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-200">Community Anchor</h5>
                    <p className="text-sm text-gray-300">
                      A permanent location establishes deep roots in the community and
                      demonstrates our long-term commitment to the area.
                    </p>
                  </li>
                  <li className="bg-gray-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-200">Program Freedom</h5>
                    <p className="text-sm text-gray-300">
                      Full control over our space allows us to adapt and expand our
                      services based on community needs without restrictions.
                    </p>
                  </li>
                  <li className="bg-gray-800/50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-200">Value Creation</h5>
                    <p className="text-sm text-gray-300">
                      Investment in real estate provides appreciation potential while
                      serving as a model for future locations.
                    </p>
                  </li>
                </ul>
              </div>

              {/* Financial Details */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Investment Details */}
                <div>
                  <h4 className="text-xl font-semibold mb-3">Property Investment Overview</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Estimated Property Cost: $2.5M - $3M</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Build-out & Improvements: $600K - $800K</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Initial Operating Capital: $400K</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Total Project Investment: $3.5M - $4.2M</span>
                    </li>
                  </ul>
                </div>

                {/* Venue Revenue Potential */}
                <div>
                  <h4 className="text-xl font-semibold mb-3">Venue Revenue Potential</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Corporate Events: $2,500 - $5,000 per event</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Weekend Private Events: $1,500 - $3,000 per event</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Weekday Community Events: $500 - $1,000 per event</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span>Potential Annual Venue Revenue: $180K - $240K</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Disclaimer */}
          <div className="text-center text-gray-400 text-sm">
            <p>
              This roadmap represents our current vision and plans. Timelines and specific 
              details may evolve based on market conditions and community needs.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </Layout>
  );
}