'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import LoadingSkeleton from '@/components/Loading';  // Changed to default import

// Define the Product type
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  variantId: string;
  sizeVariants?: {
    size: string;
    variantId: string;
    price: number;
  }[];
}



export default function Shop() {
  return (
    <ClientLayout>
      <div className="flex flex-col items-center justify-start flex-grow min-h-[calc(100vh-64px)] bg-gradient-to-b from-black to-gray-900 pt-8">
        <div className="w-full max-w-7xl px-4 py-8">
          {/* Collection Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              The Origin Collection
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Our first drop. Eight pieces designed to support your journey from dawn to dusk, 
              from grinding to unwinding.
            </p>
          </div>

          {/* Product Grid */}
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>

          {/* Mission Statement */}
          <div className="text-center text-gray-400 max-w-3xl mx-auto pb-8">
            <p>
              Every purchase supports our mission to create free mental health resources 
              and community spaces for men who are ready to write a different story.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </ClientLayout>
  );
}