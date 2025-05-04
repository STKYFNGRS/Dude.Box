'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShopifyProduct, formatPrice } from '@/utils/shopify';

export default function ShopSection() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');useEffect(() => {    async function loadProducts() {
      try {
        // Use a proper production API endpoint instead of the test one
        const response = await fetch('/api/product/featured');
        const data = await response.json();
          if (data.error) {
          console.error('API error:', data.error);
          setError('Failed to load products. Please try again later.');
          setLoading(false);
        } else if (data.sampleProducts && data.sampleProducts.length > 0) {
          // Now we can use the complete product data directly from the API
          // No need to create simplified products with placeholder data
          setProducts(data.sampleProducts.slice(0, 3));
          setLoading(false);
        } else {
          setProducts([]);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Placeholder products while loading
  const placeholderProducts = Array(3).fill(null).map((_, i) => (
    <div key={`placeholder-${i}`} className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover cursor-pointer h-full">
      <div className="w-full h-48 bg-gray-800 animate-pulse mb-4 rounded"></div>
      <div className="w-3/4 h-6 bg-gray-800 animate-pulse mb-2"></div>
      <div className="w-1/2 h-4 bg-gray-700 animate-pulse"></div>
    </div>
  ));

  return (
    <section id="shop" className="h-screen snap-always snap-start flex flex-col items-center justify-center py-12 px-4">
      <div className="section-box p-8 rounded-md max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-glitch-text-subtle text-center">Our Shop</h2>        <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
          Grab Some  <span className="text-accent animate-glitch-text-mini">Quirky</span> Tech Stuff. 
        </p>
        
        {error && <p className="text-center text-red-500 mb-6">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-slow">
          {loading ? placeholderProducts : (
            products.length === 0 ? (
              <p className="text-center text-[#b0b0b0] col-span-3">No products available at the moment. Check back soon!</p>
            ) : (
              products.map(product => (
                <Link href={`/shop/${product.handle}`} key={product.id}>
                  <div className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover relative overflow-hidden cursor-pointer h-full">
                    {/* Product Image */}
                    <div className="w-full h-48 overflow-hidden mb-3 relative">
                      {product.images.edges[0] ? (
                        <img 
                          src={product.images.edges[0].node.originalSrc} 
                          alt={product.images.edges[0].node.altText || product.title} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-4xl mb-2">🤖</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="font-bold text-lg mb-1 text-accent text-center">{product.title}</h3>
                    
                    {/* Product Price */}
                    <p className="text-[#b0b0b0] text-center">
                      {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                    </p>
                  </div>
                </Link>
              ))
            )
          )}
        </div>
        
        <div className="flex justify-center mt-8">
          <Link href="/shop" className="px-6 py-3 rounded-full border border-accent text-accent font-bold shadow-lg hover:bg-accent hover:text-white transition-all animate-fade-in animate-glitch-hover">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
