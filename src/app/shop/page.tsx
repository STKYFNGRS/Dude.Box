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
            <a href="/#about" className="transition-colors">About</a>
            <a href="/#shop" className="transition-colors text-accent font-bold animate-glitch-text-mini">Shop</a>
            <a href="/#tech" className="transition-colors">Tech</a>
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