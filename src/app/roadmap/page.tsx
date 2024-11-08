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
        "3,333 unique NFTs representing founding community members",
        "NFT holders get early access to products and events",
        "Exclusive merchandise drops for community members",
        "Community input on future product lines"
      ]
    },
    {
      title: "Phase 3: Revenue Generation",
      items: [
        "Expand product lines based on community feedback",
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
          <h2 className="text-3xl font-semibold mb-8 text-center">Physical Location Strategy</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {pathOptions.map((option, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
                <h3 className="text-2xl font-semibold mb-4">{option.title}</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Financial Requirements</h4>
                    <ul className="space-y-2 text-gray-200">
                      {option.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-center gap-2">
                          <Landmark className="w-4 h-4" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Advantages</h4>
                      <ul className="space-y-1 text-gray-200 text-sm">
                        {option.pros.map((pro, proIndex) => (
                          <li key={proIndex} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Considerations</h4>
                      <ul className="space-y-1 text-gray-200 text-sm">
                        {option.cons.map((con, conIndex) => (
                          <li key={conIndex} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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