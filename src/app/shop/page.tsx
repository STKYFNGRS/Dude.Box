"use client";

import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Dude Mood Mug",
    description: "Thermal Reactive Coffee Cup",
    price: 24.99,
    image: "/product-images/Dude Mood Coffee Mug.jpg",
    category: "Accessories"
  },
  {
    id: 2,
    name: "We Ride At Dawn",
    description: "A Light Roast For Clear Minds",
    price: 19.99,
    image: "/product-images/Light Roast Coffee Dude Front.jpg",
    category: "Coffee"
  },
  {
    id: 3,
    name: "Peak Dude Roast",
    description: "Because Mornings Don't Have To Suck",
    price: 19.99,
    image: "/product-images/Medium Roast Coffee Dude Front.jpg",
    category: "Coffee"
  },
  {
    id: 4,
    name: "Welcome To The Dark Side, Dude",
    description: "A French Roast That Punches Back",
    price: 19.99,
    image: "/product-images/Dark Roast Coffee Dude Front.jpg",
    category: "Coffee"
  },
  {
    id: 5,
    name: "It's a Pickleball Kit, Dude",
    description: "Game On",
    price: 39.99,
    image: "/product-images/Pickleball.jpg",
    category: "Sports"
  },
  {
    id: 6,
    name: "Dude Comfort Hoodie",
    description: "You Need This",
    price: 49.99,
    image: "/product-images/Dude Hoodie.jpg",
    category: "Apparel"
  },
  {
    id: 7,
    name: "Dude Basic Tee",
    description: "Daily Comfort",
    price: 29.99,
    image: "/product-images/Dude Tee.jpg",
    category: "Apparel"
  },
  {
    id: 8,
    name: "Dude Recovery Slides",
    description: "Because Your Feet Earned This",
    price: 34.99,
    image: "/product-images/Slides.jpg",
    category: "Footwear"
  },
];

export default function Shop() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="w-full max-w-7xl p-4">
          {/* Collection Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              The Origin Collection (Coming Soon)
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Our first drop. Eight pieces designed to support your journey from dawn to dusk, 
              from grinding to unwinding.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all"
              >
                <div className="p-4">
                  <div className="aspect-square relative mb-4 bg-gray-900 rounded-md overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                  <div className="text-sm text-gray-400 mb-2">{product.category}</div>
                  <div className="text-xl font-bold mb-4">${product.price}</div>
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                    onClick={() => {
                      // Add Shopify purchase handling here
                      console.log(`Add to cart: ${product.name}`);
                    }}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="mt-12 text-center text-gray-400 max-w-3xl mx-auto">
            <p>
              Every purchase supports our mission to create free mental health resources 
              and community spaces for men who are ready to write a different story.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </Layout>
  );
}