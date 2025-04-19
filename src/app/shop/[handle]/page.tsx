'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShopifyProduct, formatPrice } from '@/utils/shopify';
import MatrixRain from '@/components/MatrixRain';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

export default function ProductPage({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { addToCart } = useCart();  useEffect(() => {
    async function loadProduct() {
      try {
        // Use the product featured API route 
        const response = await fetch('/api/product/featured');
        const data = await response.json();
        
        if (data.error) {
          setError(`API Error: ${data.error}`);
          setLoading(false);
          return;
        }
        
        // Find the product that matches the handle parameter
        if (data.sampleProducts && data.sampleProducts.length > 0) {          // Find product by handle, ID, or slug from title
          const productMatch = data.sampleProducts.find((p: any) => {
            // Check for direct handle match if it exists
            if (p.handle && p.handle === params.handle) {
              return true;
            }
            
            // Check ID match (last segment)
            if (p.id && p.id.split('/').pop() === params.handle) {
              return true;
            }
            
            // Check title match (convert to slug)
            const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            return titleSlug === params.handle;
          });
          
          if (productMatch) {
            // Now use the actual product data from the API instead of placeholder data
            setProduct(productMatch as ShopifyProduct);
          } else {
            setError('Product not found');
          }
        } else {
          setError('No products available');
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.handle]);

  const handleVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
  };

  // Get the current variant
  const currentVariant = product?.variants.edges[selectedVariantIndex]?.node;  return (
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

      {/* Product Detail Content */}
      <main className="pt-24 pb-16 px-4 md:px-8 relative z-10">
        <div className="container mx-auto">
          <div className="section-box p-4 md:p-8 rounded-md mb-8 animate-fade-in">
            <Link href="/shop" className="flex items-center gap-2 text-accent hover:text-white transition-colors mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Shop
            </Link>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="w-full h-96 bg-gray-800 animate-pulse rounded"></div>
                <div className="flex flex-col gap-4">
                  <div className="w-3/4 h-8 bg-gray-800 animate-pulse"></div>
                  <div className="w-1/2 h-6 bg-gray-700 animate-pulse"></div>
                  <div className="w-full h-40 bg-gray-800 animate-pulse"></div>
                  <div className="w-1/3 h-10 bg-gray-700 animate-pulse mt-auto"></div>
                </div>
              </div>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : product ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image Gallery */}
                <div className="space-y-4">
                  <div className="w-full h-80 md:h-96 overflow-hidden rounded border border-gray-800">
                    {product.images.edges[0] ? (
                      <img 
                        src={product.images.edges[0].node.originalSrc} 
                        alt={product.images.edges[0].node.altText || product.title} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-6xl">🤖</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {product.images.edges.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {product.images.edges.map((image, index) => (
                        <button 
                          key={index}
                          className="w-16 h-16 overflow-hidden rounded border border-gray-800 hover:border-accent focus:border-accent transition-colors"
                        >
                          <img 
                            src={image.node.originalSrc} 
                            alt={image.node.altText || `${product.title} - Image ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                  {/* Product Details */}
                <div className="flex flex-col section-box p-6 rounded-lg">
                  <h1 className="text-3xl md:text-4xl font-bold text-accent mb-2 animate-glitch-text-subtle">
                    {product.title}
                  </h1>
                    <div className="mb-4">
                    <p className="text-2xl text-white font-bold">
                      {currentVariant 
                        ? formatPrice(currentVariant.price.amount, currentVariant.price.currencyCode) 
                        : formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                    </p>
                  </div>
                  
                  {/* Variants */}
                  {product.variants.edges.length > 1 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-2">Options</h3>
                      <div className="flex flex-wrap gap-3">
                        {product.variants.edges.map((variant, index) => (
                          <button 
                            key={variant.node.id}
                            onClick={() => handleVariantChange(index)}
                            className={`px-3 py-2 border rounded-md ${
                              selectedVariantIndex === index 
                                ? 'border-accent text-accent' 
                                : 'border-gray-600 text-gray-300 hover:border-gray-400'
                            } transition-colors`}
                            disabled={!variant.node.availableForSale}
                          >
                            {variant.node.title}
                            {!variant.node.availableForSale && " (Sold Out)"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                    {/* Description */}
                  <div className="mb-6 section-box p-4 rounded">
                    <h3 className="text-lg font-bold mb-2 text-accent">Description</h3>
                    <div className="text-[#b0b0b0] prose prose-invert max-w-none" 
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                    {/* Buy Button */}
                  <div className="mt-auto">
                    {/* Quantity selector */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-white">Quantity:</span>
                      <div className="flex">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="h-10 w-10 flex items-center justify-center border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors rounded-l-md"
                        >
                          -
                        </button>
                        <div className="h-10 w-12 flex items-center justify-center border-t border-b border-gray-700 text-white">
                          {quantity}
                        </div>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="h-10 w-10 flex items-center justify-center border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors rounded-r-md"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full md:w-auto px-8 py-4 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-opacity-80 transition-all animate-fade-in animate-glitch-hover"
                      onClick={() => {
                        if (product) {
                          addToCart(product, quantity);
                        }
                      }}
                      disabled={currentVariant && !currentVariant.availableForSale}
                    >
                      {currentVariant && !currentVariant.availableForSale ? 'Sold Out' : 'Add to Cart'}
                    </button>

                    <div className="text-sm text-gray-400 mt-4">
                      <p>Note: Robot may contain sentience. Keep away from small children and AI researchers.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 p-8 border-t border-gray-800 z-10 mt-auto">
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
