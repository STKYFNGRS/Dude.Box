"use client";

import { Analytics } from "@vercel/analytics/react";
import Layout from "@/app/layout";
import { ArrowRight, Store, Users, Landmark, Coffee, Gamepad } from "lucide-react";

export default function Roadmap() {
  const phases = [
    {
      title: "Phase 1: Online Foundation (We are here)",
      items: [
        "Build initial community through social media and content",
        "Establish brand identity and mission awareness",
        "Launch core product line focusing on quality basics",
        "Initial team building and operations setup",
        "Target: $1.5M in first-year revenue from online sales",
        "Establish $800K emergency fund"
      ]
    },
    {
      title: "Phase 2: Community Building",
      items: [
        "Development of NFT infrastructure and community platform",
        "NFT platform testing and deployment",
        "Launch dude.box NFT Collection",
        "Unique NFTs representing founding community members",
        "Target: $2.0M in annual revenue across all channels"
      ]
    },
    {
      title: "Phase 3: Revenue Generation",
      items: [
        "Expand product lines based on community feedback",
        "Announce retail partnerships",
        "Launch subscription box service",
        "Scale NFT holder engagement features",
        "Develop partnerships with mental health professionals",
        "Target: $3.5M in annual revenue",
        "Begin location scouting and property analysis"
      ]
    },
    {
      title: "Phase 4: Physical Location",
      items: [
        "Site selection and market analysis in San Diego",
        "Architectural planning and design",
        "Local community engagement",
        "Initial staff recruitment and training",
        "NFT holder physical space integration",
        "Target: $4M+ in annual revenue with physical location"
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
                        <Coffee className="w-4 h-4" />
                        <span>Social lounge with coffee & mocktail bar (800 sq ft)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Gamepad className="w-4 h-4" />
                        <span>Entertainment area with pool tables and gaming (1,000 sq ft)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Counseling spaces and offices (700 sq ft)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Multi-purpose event venue (1,500 sq ft)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Community meeting rooms (500 sq ft)</span>
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
                        <span>Warehouse and fulfillment center (1,500 sq ft)</span>
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
                      <span>Property Purchase: $2.5M - $3M</span>
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
                      <span>Total Cash Investment Needed: $3.5M - $4.2M</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-200">Funding Strategy</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Initial operations revenue (Years 1-2)</li>
                      <li>• NFT Community Pass sale proceeds</li>
                      <li>• No mortgage needed - full cash purchase</li>
                      <li>• Significantly reduces long-term operating costs</li>
                      <li>• Enables immediate full property utilization</li>
                    </ul>
                  </div>
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
                      <span>Projected Annual Venue Revenue: $243K - $324K</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                    <h5 className="font-semibold mb-2 text-gray-200">Additional Benefits</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Full control over space utilization</li>
                      <li>• Flexibility for community programming</li>
                      <li>• No rental restrictions on events</li>
                      <li>• Property value appreciation potential</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-8 text-center">The Bottom Line</h2>
          {/* Staffing Plan */}
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800 mb-16">
    <h4 className="text-xl font-semibold mb-6">Staffing Requirements (San Diego Market)</h4>
    <div className="grid md:grid-cols-2 gap-8">
      {/* Retail & Community Operations */}
      <div className="space-y-4">
        <h5 className="font-semibold text-gray-200">Front of House Staff</h5>
        <ul className="space-y-3 text-gray-200">
          <li className="flex items-center justify-between">
            <span>General Manager (1)</span>
            <span>$100K/yr</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Retail Supervisors (2)</span>
            <span>$61K/yr each</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Retail Associates (4 PT)</span>
            <span>$45K/yr each</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Barista/Mocktail Staff (3 PT)</span>
            <span>$45K/yr each</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Event Coordinator (1)</span>
            <span>$61K/yr</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Community Outreach Manager (1)</span>
            <span>$74K/yr</span>
          </li>
        </ul>
      </div>

      {/* Operations & Support */}
      <div className="space-y-4">
        <h5 className="font-semibold text-gray-200">Back of House Staff</h5>
        <ul className="space-y-3 text-gray-200">
          <li className="flex items-center justify-between">
            <span>Operations Manager (1)</span>
            <span>$95K/yr</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Product Designer (1)</span>
            <span>$88K/yr</span>
          </li>
          <li className="flex items-center justify-between">
            <span>E-commerce Manager (1)</span>
            <span>$74K/yr</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Warehouse Staff (2)</span>
            <span>$47K/yr each</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Marketing Manager (1)</span>
            <span>$81K/yr</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Mental Health Coordinator (1)</span>
            <span>$74K/yr</span>
          </li>
        </ul>
      </div>

      {/* Technology & Mental Health Staff */}
      <div className="space-y-4 md:col-span-2">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tech Section */}
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-200">Technology</h5>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-center justify-between">
                <span>Technical Director (1)</span>
                <span>$250K/yr</span>
              </li>
              <li className="text-sm text-gray-300 mt-2">
                Oversees all technical aspects including e-commerce platform, 
                NFT integration, and digital community features.
              </li>
            </ul>
          </div>

          {/* Mental Health Section */}
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-200">Mental Health Professionals</h5>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-center justify-between">
                <span>Licensed Therapists (2)</span>
                <span>$108K/yr each</span>
              </li>
              <li className="text-sm text-gray-300 mt-2">
                Note: Therapists provide free community mental health services as part of our core mission. 
                This is a cost center that directly supports our community impact goals.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Seasonal Staff Section */}
      <div className="space-y-4 md:col-span-2">
        <h5 className="font-semibold text-gray-200">Seasonal & Event Staff</h5>
        <ul className="space-y-3 text-gray-200">
          <li className="flex items-center justify-between">
            <span>Peak Season Support (Up to 8 PT)</span>
            <span>$85K/yr total</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Event Staff Pool (Up to 5 PT)</span>
            <span>$90K/yr total</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Holiday Coverage (Up to 4 PT)</span>
            <span>$50K/yr total</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
      <div className="space-y-3">
        <p className="text-gray-200">
          Total Annual Staff Cost: ~$2.22M (including 20% benefits overhead)
        </p>
        <p className="text-sm text-gray-300">
          Benefits package includes health insurance, retirement matching, paid time off, 
          professional development allowance, and mental health support services.
        </p>
      </div>
    </div>
  </div>
          {/* Revenue Projections */}
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800 mb-16">
    <h4 className="text-xl font-semibold mb-6">Annual Revenue Streams (San Diego Market)</h4>
    <div className="grid md:grid-cols-2 gap-8">
      {/* Primary Revenue */}
      <div className="space-y-4">
        <h5 className="font-semibold text-gray-200">Core Business Revenue</h5>
        <ul className="space-y-3 text-gray-200">
          <li className="flex items-center justify-between">
            <span>Online Sales</span>
            <span>$1.62M - $2.03M</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Physical Retail</span>
            <span>$1.08M - $1.35M</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Subscription Boxes</span>
            <span>$540K - $675K</span>
          </li>
        </ul>
      </div>

      {/* Secondary Revenue */}
      <div className="space-y-4">
        <h5 className="font-semibold text-gray-200">Auxiliary Revenue</h5>
        <ul className="space-y-3 text-gray-200">
          <li className="flex items-center justify-between">
            <span>Venue Rentals</span>
            <span>$243K - $324K</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Mocktail Bar</span>
            <span>$203K - $270K</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Coffee Shop</span>
            <span>$162K - $243K</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Gaming/Entertainment</span>
            <span>$68K - $101K</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Operating Expenses Breakdown */}
    <div className="mt-8 space-y-4">
    <h5 className="font-semibold text-gray-200">Operating Expenses Breakdown</h5>
    <ul className="space-y-2 text-gray-200">
      <li className="flex items-center justify-between">
        <span>Staff Costs (inc. benefits)</span>
        <span>$2.22M/yr</span>
      </li>
      <li className="flex items-center justify-between">
        <span>Property Taxes & Insurance</span>
        <span>$120K/yr</span>
      </li>
      <li className="flex items-center justify-between">
        <span>Utilities & Maintenance</span>
        <span>$180K/yr</span>
      </li>
      <li className="flex items-center justify-between">
        <span>Inventory & COGS</span>
        <span>$400K - $500K/yr</span>
      </li>
      <li className="flex items-center justify-between">
        <span>Marketing & Advertising</span>
        <span>$200K - $250K/yr</span>
      </li>
      <li className="flex items-center justify-between">
        <span>Technology & Operations</span>
        <span>$100K - $125K/yr</span>
      </li>
      <li className="flex items-center justify-between">
        <span>Cloud Services & Software</span>
        <span>$60K - $75K/yr</span>
      </li>
      <li className="flex items-center justify-between">
        <span>Community Platform Development</span>
        <span>$40K - $50K/yr</span>
      </li>
    </ul>
  </div>

    {/* Financial Summary */}
    <div className="mt-6 space-y-4 p-4 bg-gray-800/50 rounded-lg">
    <div className="flex justify-between text-gray-200">
      <span className="font-semibold">Total Projected Annual Revenue:</span>
      <span>$3.92M - $5.0M</span>
    </div>
    <div className="flex justify-between text-gray-200">
      <span className="font-semibold">Estimated Operating Expenses:</span>
      <span>$3.32M - $3.55M</span>
    </div>
    <div className="flex justify-between text-gray-200">
      <span className="font-semibold">Projected Net Profit:</span>
      <span>$600K - $1.45M</span>
    </div>
    <p className="text-sm text-gray-300 mt-4">
      Note: Our increased investment in top-tier technical leadership, robust marketing strategies, 
      and community engagement platforms reflects our commitment to sustainable growth. While this 
      impacts our initial profit margins, it positions us for stronger long-term success and 
      community engagement. The absence of property mortgage costs continues to provide 
      significant operational flexibility, while our enhanced marketing and technology budgets 
      ensure we can effectively grow and engage our community.
    </p>
  </div>
  </div>

          {/* Timeline Disclaimer */}
          <div className="text-center text-gray-400 text-sm mb-8">
            <p>
            As we grow together, our roadmap may evolve to meet new opportunities and community needs.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </Layout>
  );
}