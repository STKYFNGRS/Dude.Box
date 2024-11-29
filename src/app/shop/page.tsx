'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getAllProducts } from '@/lib/shopify';
import { useState, useEffect } from 'react';
import type { ShopifyProduct } from '@/types/shopify';

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        if (mounted) {
          setProducts(fetchedProducts);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load products. Please try again later.');
          console.error('Error fetching products:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.productType)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  // Filter products based on selected category
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.productType === selectedCategory)
    : products;

  if (error) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-32">
          <div className="container mx-auto px-4">
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 pt-32 pb-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Origin Collection
            </h1>
            <p className="text-xl text-gray-300">
              Quality basics
            </p>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                    ${!selectedCategory 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                      ${selectedCategory === category 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <LoadingSpinner />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
        <Analytics />
      </main>
    </ClientLayout>
  );
}