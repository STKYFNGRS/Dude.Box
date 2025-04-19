'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShopifyProduct, formatPrice } from '@/utils/shopify';
import MatrixRain from '@/components/MatrixRain';
import CartIcon from '@/components/CartIcon';

export default function ShopPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    useEffect(() => {
    async function loadProducts() {
      try {
        // Use the product featured API route
        const response = await fetch('/api/product/featured');
        const data = await response.json();
        
        if (data.error) {
          console.error('API error:', data.error);
          setError('Failed to load products. Please try again later.');
          setLoading(false);
        } else if (data.sampleProducts && data.sampleProducts.length > 0) {
          // Use the complete product data directly from the API
          setProducts(data.sampleProducts);
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
  const placeholderProducts = Array(6).fill(null).map((_, i) => (
    <div key={`placeholder-${i}`} className="section-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
      <div className="w-full h-48 bg-gray-800 animate-pulse mb-4 rounded"></div>
      <div className="w-3/4 h-6 bg-gray-800 animate-pulse mb-2"></div>
      <div className="w-1/2 h-4 bg-gray-700 animate-pulse"></div>
    </div>
  ));
  
  return (
    <div className="min-h-screen flex flex-col text-[#EDEDED] font-mono bg-black">
      {/* Matrix-style rain overlay */}
      <MatrixRain />
      
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 p-4 border-b border-gray-800 shadow-lg bg-gradient-to-b from-[#181818] to-[#111111] z-20 backdrop-blur">
        <div className="container mx-auto flex justify-between items-center">
          {/* Wrap logo image in an anchor tag linking to root */}
          <a href="/" aria-label="Return to homepage">
            <div className="flex items-center gap-3">
              <img src="/android-chrome-192x192.png" alt="D.U.D.E. Box Logo" className="h-14 w-14 drop-shadow-lg animate-spin-slow" />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-lg">
            <Link href="/#about" className="transition-colors">About</Link>
            <Link href="/shop" className="transition-colors text-accent font-bold animate-glitch-text-mini">Shop</Link>
            <Link href="/#tech" className="transition-colors">Tech</Link>
            <Link href="/#contact" className="transition-colors">Contact</Link>
          </nav>

          {/* Cart Icon - Always visible */}
          <CartIcon />

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden z-50" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2 bg-white' : 'bg-gray-300'}`}></div>
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : 'bg-gray-300'}`}></div>
            <div className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 bg-white' : 'bg-gray-300'}`}></div>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu - Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-95 z-40 flex items-center justify-center transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-8 text-2xl">
          <Link href="/#about" className="hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/shop" className="text-accent font-bold animate-glitch-text-mini" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          <Link href="/#tech" className="hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Tech</Link>
          <Link href="/#contact" className="hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </nav>
      </div>

      {/* Shop Content */}
      <main className="pt-24 pb-16 px-4 md:px-8 relative z-10">
        <div className="container mx-auto">
          <div className="section-box p-8 rounded-md mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-center text-accent drop-shadow-lg animate-glitch mb-2">
              Dude.Box Shop
            </h1>
            <p className="max-w-2xl mx-auto text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
              All our <span className="text-accent animate-glitch-text-mini">robots, kits, and tech wonders</span> in one place. Each item is crafted with our signature glitchy perfection.
            </p>
          </div>

          {error && (
            <div className="section-box p-8 rounded-md">
              <p className="text-center text-red-500">{error}</p>
            </div>
          )}

          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-slow">
              {loading
                ? placeholderProducts
                : products.length === 0
                ? <p className="text-center text-[#b0b0b0] col-span-full">No products available at the moment. Check back soon!</p>
                : products.map(product => (
                    <Link href={`/shop/${product.handle}`} key={product.id}>
                      <div className="section-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover relative overflow-hidden h-full cursor-pointer">
                        {/* Product Image */}
                        <div className="w-full h-48 overflow-hidden mb-4 relative">
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
                        <h2 className="font-bold text-lg mb-1 text-accent text-center">{product.title}</h2>
                        
                        {/* Product Price */}
                        <p className="text-[#b0b0b0] text-center mb-3">
                          {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                        </p>
                        
                        {/* Description Preview */}
                        <p className="text-[#b0b0b0] text-sm text-center line-clamp-3 mb-4">
                          {product.description}
                        </p>
                        
                        {/* View Details Button */}
                        <div className="mt-auto">
                          <div className="px-4 py-2 rounded-full bg-accent text-white font-bold text-sm hover:bg-opacity-80 transition-all animate-glitch-hover">
                            View Details
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
              }
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Link href="/" className="px-6 py-3 rounded-full border border-accent text-accent font-bold shadow-lg hover:bg-accent hover:text-white transition-all animate-fade-in animate-glitch-hover">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 p-8 border-t border-gray-800 z-10 mt-auto relative">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/android-chrome-192x192.png" alt="D.U.D.E. Box Logo" className="h-8 w-8 favicon-spin" />
            <span className="font-bold text-white animate-glitch-text-mini">Dude Dot Box LLC</span>
          </div>
          <div className="text-xs text-center md:text-right">
            &copy; {new Date().getFullYear()} Dude Dot Box LLC. All rights reserved. <span className="text-accent">|</span> Built in the wasteland.
          </div>
        </div>
      </footer>
    </div>
  );
}
