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
            <a href="/#about" className="transition-colors">About</a>
            <a href="/#shop" className="transition-colors text-accent font-bold animate-glitch-text-mini">Shop</a>
            <a href="/#contact" className="transition-colors">Contact</a>
          </nav>

          <div className="flex items-center">
            {/* Cart Icon - Always visible */}
            <CartIcon />

            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden z-50 ml-4" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2 bg-white' : 'bg-gray-300'}`}></div>
              <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : 'bg-gray-300'}`}></div>
              <div className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 bg-white' : 'bg-gray-300'}`}></div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-30 md:hidden">
          <div className="flex flex-col items-center h-full space-y-8 text-2xl pt-32">
            <a 
              href="/#about" 
              className="transition-colors p-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="/#shop" 
              className="transition-colors p-4 text-accent font-bold animate-glitch-text-mini"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </a>
            <a 
              href="/#tech" 
              className="transition-colors p-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tech
            </a>
            <a 
              href="/#contact" 
              className="transition-colors p-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      )}

      {/* Extra Close Button - Only visible when menu is open */}
      {mobileMenuOpen && (
        <button 
          className="fixed top-4 z-[9999] flex items-center" 
          style={{ right: '1rem' }}
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <div className="rounded-full p-2 bg-accent">
            <div className="w-6 h-0.5 bg-white mb-1.5 rotate-45 translate-y-2"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5 opacity-0"></div>
            <div className="w-6 h-0.5 bg-white -rotate-45"></div>
          </div>
        </button>
      )}

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
                  
                  {/* Variants - Using proper Shopify options data */}
                  {product.options && product.options.length > 0 && (
                    <div className="mb-6 space-y-4">
                      <h3 className="text-lg font-bold">Options</h3>
                      
                      {/* Map through each option type (like Color, Size) */}
                      {product.options.map((option, index) => {
                        // Get current selection for this option
                        const currentVariant = product.variants.edges[selectedVariantIndex].node;
                        const currentSelection = currentVariant.selectedOptions.find(
                          opt => opt.name === option.name
                        )?.value || '';
                        
                        // For Color option, use buttons with swatches
                        if (option.name.toLowerCase() === 'color') {
                          return (
                            <div key={option.id} className="mb-4">
                              <label className="block text-white mb-2">Select {option.name}</label>
                              <div className="flex flex-wrap gap-3">
                                {option.values.map(value => {
                                  // Check if this option combination is available
                                  // We need to find a variant that matches current selections but with this color
                                  
                                  // Get all current selections
                                  const otherSelections = currentVariant.selectedOptions
                                    .filter(opt => opt.name !== option.name)
                                    .map(opt => ({ name: opt.name, value: opt.value }));
                                  
                                  // Find a variant with this color and same other options
                                  const matchingVariantEdge = product.variants.edges.find(edge => {
                                    const variant = edge.node;
                                    // Must have this color
                                    const hasThisColor = variant.selectedOptions.some(
                                      opt => opt.name === option.name && opt.value === value
                                    );
                                    
                                    // Must match all other selected options
                                    const matchesOtherOptions = otherSelections.every(selection => 
                                      variant.selectedOptions.some(
                                        opt => opt.name === selection.name && opt.value === selection.value
                                      )
                                    );
                                    
                                    return hasThisColor && matchesOtherOptions;
                                  });
                                  
                                  const isAvailable = matchingVariantEdge?.node.availableForSale || false;
                                  const variantIndex = matchingVariantEdge ? 
                                    product.variants.edges.indexOf(matchingVariantEdge) : -1;
                                  
                                  return (
                                    <button 
                                      key={value}
                                      className={`px-3 py-2 border rounded-md ${
                                        currentSelection === value
                                          ? 'border-accent text-accent' 
                                          : isAvailable 
                                            ? 'border-gray-600 text-gray-300 hover:border-gray-400'
                                            : 'border-gray-800 text-gray-600 cursor-not-allowed'
                                      } transition-colors`}
                                      disabled={!isAvailable}
                                      onClick={() => {
                                        if (variantIndex !== -1) {
                                          handleVariantChange(variantIndex);
                                        }
                                      }}
                                    >
                                      {value}
                                      {!isAvailable && " (Sold Out)"}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                        
                        // For all other options (like Size), use a dropdown
                        return (
                          <div key={option.id} className="mb-4">
                            <label className="block text-white mb-2">Select {option.name}</label>
                            <select
                              className="w-full bg-[#111111] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-accent focus:outline-none"
                              value={currentSelection}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                
                                // Get all current selections
                                const newSelections = currentVariant.selectedOptions.map(opt => 
                                  opt.name === option.name 
                                    ? { name: opt.name, value: newValue }
                                    : { name: opt.name, value: opt.value }
                                );
                                
                                // Find a variant that matches these selections
                                const matchingVariantIndex = product.variants.edges.findIndex(edge => {
                                  const variant = edge.node;
                                  return newSelections.every(selection => 
                                    variant.selectedOptions.some(
                                      opt => opt.name === selection.name && opt.value === selection.value
                                    )
                                  );
                                });
                                
                                if (matchingVariantIndex !== -1) {
                                  handleVariantChange(matchingVariantIndex);
                                }
                              }}
                            >
                              {option.values.map(value => {
                                // Check if this option combination is available
                                // We need to find a variant that matches current selections but with this value
                                
                                // Get all current selections
                                const otherSelections = currentVariant.selectedOptions
                                  .filter(opt => opt.name !== option.name)
                                  .map(opt => ({ name: opt.name, value: opt.value }));
                                
                                // Find a variant with this value and same other options
                                const matchingVariantEdge = product.variants.edges.find(edge => {
                                  const variant = edge.node;
                                  // Must have this value
                                  const hasThisValue = variant.selectedOptions.some(
                                    opt => opt.name === option.name && opt.value === value
                                  );
                                  
                                  // Must match all other selected options
                                  const matchesOtherOptions = otherSelections.every(selection => 
                                    variant.selectedOptions.some(
                                      opt => opt.name === selection.name && opt.value === selection.value
                                    )
                                  );
                                  
                                  return hasThisValue && matchesOtherOptions;
                                });
                                
                                const isAvailable = matchingVariantEdge?.node.availableForSale || false;
                                
                                return (
                                  <option 
                                    key={value} 
                                    value={value}
                                    disabled={!isAvailable}
                                  >
                                    {value}{!isAvailable && " (Sold Out)"}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        );
                      })}
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
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="h-10 w-12 flex items-center justify-center border-t border-b border-gray-700 text-white">
                          {quantity}
                        </span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="h-10 w-10 flex items-center justify-center border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors rounded-r-md"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full md:w-auto px-8 py-4 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-opacity-80 transition-all animate-fade-in animate-glitch-hover disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        // Ensure product and currentVariant exist before adding to cart
                        if (product && currentVariant) {
                          addToCart(product, currentVariant, quantity); // Pass product, selected variant, and quantity
                        } else {
                          console.error("Cannot add to cart: Product or variant not selected/available.");
                          // Optionally show an error message to the user
                        }
                      }}
                      disabled={!currentVariant || !currentVariant.availableForSale}
                    >
                      {currentVariant && currentVariant.availableForSale ? 'Add to Cart' : 'Sold Out'}
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

      {/* Global Styles for Animations and Components */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Section and card styling to match header */
        .section-box {
          background: linear-gradient(to bottom, #181818, #111111);
          border: 1px solid #222;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 5;
        }
        
        .card-box {
          background: linear-gradient(to bottom, #1a1a1a, #131313);
          border: 1px solid rgba(255, 0, 68, 0.4);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
          position: relative;
          z-index: 6;
        }
        
        /* Color definitions */
        .text-accent { color: #ff0044; }
        .bg-accent { background: #ff0044; }
        .border-accent { border-color: #ff0044; }
        
        /* Main title glitch effect */
        .animate-glitch {
          animation: glitch 2.5s infinite linear alternate-reverse;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 #ff0044, -2px 0 #00fff7; }
          20% { text-shadow: -2px 2px #ff0044, 2px -2px #00fff7; }
          40% { text-shadow: 2px -2px #ff0044, -2px 2px #00fff7; }
          60% { text-shadow: 0 2px #ff0044, 0 -2px #00fff7; }
          80% { text-shadow: 2px 2px #ff0044, -2px -2px #00fff7; }
          100% { text-shadow: -2px 0 #ff0044, 2px 0 #00fff7; }
        }
        
        /* Subtle glitch for subtitles */
        .animate-glitch-subtle {
          animation: glitchSubtle 2.5s infinite linear alternate-reverse;
        }
        @keyframes glitchSubtle {
          0% { text-shadow: 1px 0 #ff0044, -1px 0 #00fff7; transform: translateX(0); }
          25% { text-shadow: -1px 1px #ff0044, 1px -1px #00fff7; transform: translateX(-2px); }
          50% { text-shadow: 1px -1px #ff0044, -1px 1px #00fff7; transform: translateX(2px); }
          75% { text-shadow: 0 1px #ff0044, 0 -1px #00fff7; transform: translateX(-1px); }
          100% { text-shadow: -1px 0 #ff0044, 1px 0 #00fff7; transform: translateX(0); }
        }
        
        /* Mini glitch for smaller text elements */
        .animate-glitch-text-mini {
          animation: glitchTextMini 4s infinite linear alternate-reverse;
        }
        @keyframes glitchTextMini {
          0% { text-shadow: 1px 0 #00fff7, 0 0 transparent; }
          25% { text-shadow: -1px 0 #ff0044, 0 0 transparent; }
          50% { text-shadow: 0.5px 0 #00fff7, -0.5px 0 #ff0044; }
          75% { text-shadow: -0.5px 0 #00fff7, 0.5px 0 #ff0044; }
          100% { text-shadow: 1px 0 #00fff7, -1px 0 transparent; }
        }
        
        /* Hover glitch effect for buttons/cards */
        .animate-glitch-hover {
          transition: all 0.3s ease;
          position: relative;
        }
        .animate-glitch-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 0 10px rgba(255, 0, 68, 0.5), 0 0 15px rgba(0, 255, 247, 0.3);
        }

        /* Other animations */
        .animate-flicker {
          animation: flicker 2s infinite alternate;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
          60% { opacity: 0.4; }
          80% { opacity: 0.9; }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease-in;
        }
        .animate-fade-in-slow {
          animation: fadeIn 2.2s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        .favicon-spin {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .bg-noise {
          background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><filter id="n" x="0" y="0"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(%23n)" opacity="0.5"/></svg>');
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .section-box {
            width: 95%;
            padding: 1.5rem; /* Reduced padding */
            margin-top: 1rem; /* Add some top margin */
            margin-bottom: 1rem; /* Add some bottom margin */
            /* Add max-height and overflow to prevent overlap */
            max-height: calc(100vh - 4rem - 2rem); /* 100vh - header height - top/bottom margin */
            overflow-y: auto;
            /* Hide internal scrollbar */
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .section-box::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          
          /* Reduce gaps */
          .gap-2 { gap: 0.5rem; }
          .gap-3 { gap: 0.75rem; }
          .gap-4 { gap: 0.75rem; }
          .gap-6 { gap: 1rem; }
          .mt-2 { margin-top: 0.5rem; }
          .mt-4 { margin-top: 1rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-6 { margin-bottom: 1.25rem; }

          /* Adjust footer */
          footer .container {
            flex-direction: column; /* Stack elements vertically */
            gap: 0.5rem; /* Reduce gap */
          }
          footer .text-xs {
            text-align: center; /* Center text */
          }
        }

        /* Scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Ensure background colors appear */
        body {
          background-color: black;
        }
      `}</style>

      {/* Favicon Spinner Script */}
      <script dangerouslySetInnerHTML={{__html:`
        (function() {
          const faviconUrl = '/android-chrome-192x192.png';
          let angle = 0;
          let link = document.querySelector('link[rel="icon"]') || document.createElement('link');
          link.rel = 'icon';
          link.type = 'image/png';
          if (!link.parentNode) document.head.appendChild(link);
          const img = new window.Image();
          img.src = faviconUrl;
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            function draw() {
              ctx.clearRect(0, 0, size, size);
              ctx.save();
              ctx.translate(size/2, size/2);
              ctx.rotate(angle * Math.PI / 180);
              ctx.drawImage(img, -size/2, -size/2, size, size);
              ctx.restore();
              link.href = canvas.toDataURL('image/png');
              angle = (angle + 0.5) % 360; // Slower spin to match header logo
              requestAnimationFrame(draw);
            }
            draw();
          };
        })();
      `}} />
    </div>
  );
}