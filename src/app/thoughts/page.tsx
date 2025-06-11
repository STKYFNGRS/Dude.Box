'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MatrixRain from "@/components/MatrixRain";
import CartIcon from "@/components/CartIcon";

interface ThoughtMeta {
  title: string;
  date: string;
  slug: string;
  category: string;
  description?: string;
}

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<ThoughtMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load thoughts metadata
    async function loadThoughts() {
      try {
        const response = await fetch('/api/thoughts');
        const data = await response.json();
        
        if (data.thoughts) {
          // Sort by date (newest first)
          const sortedThoughts = data.thoughts.sort((a: ThoughtMeta, b: ThoughtMeta) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setThoughts(sortedThoughts);
        }
      } catch (error) {
        console.error('Failed to load thoughts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadThoughts();
  }, []);

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
            <a href="/#projects" className="transition-colors">Projects</a>
            <a href="/token" className="transition-colors">Token</a>
            <a href="/shop" className="transition-colors">Shop</a>
            <a href="/thoughts" className="transition-colors text-accent font-bold animate-glitch-text-mini">Thoughts</a>
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
              href="/#projects" 
              className="transition-colors p-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </a>
            <a 
              href="/token" 
              className="transition-colors p-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Token
            </a>
            <a 
              href="/shop" 
              className="transition-colors p-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </a>
            <a 
              href="/thoughts" 
              className="transition-colors p-4 text-accent font-bold animate-glitch-text-mini"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thoughts
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

      {/* Thoughts Content */}
      <main className="pt-32 pb-16 px-4 md:px-8 relative z-10">
        <div className="container mx-auto">
          <div className="section-box p-8 rounded-md mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-center text-accent drop-shadow-lg animate-glitch mb-2">
              Dude Thoughts
            </h1>
            <p className="max-w-2xl mx-auto text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
              Social commentary and observations from the <span className="text-accent animate-glitch-text-mini">wasteland</span>
            </p>
          </div>

          {loading ? (
            <div className="section-box p-8 rounded-md">
              <div className="space-y-4">
                {Array(5).fill(null).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-6 bg-gray-800 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : thoughts.length === 0 ? (
            <div className="section-box p-8 rounded-md text-center">
              <p className="text-[#b0b0b0] text-lg">No thoughts posted yet. Check back soon for some wasteland wisdom.</p>
            </div>
          ) : (
            <div className="section-box p-8 rounded-md">
              <div className="space-y-4">
                {thoughts.map((thought) => (
                  <Link key={thought.slug} href={`/thoughts/${thought.slug}`}>
                    <div className="group cursor-pointer border-b border-gray-800 pb-4 last:border-b-0 last:pb-0 hover:border-accent transition-colors">
                      <h2 className="text-xl font-bold text-accent group-hover:animate-glitch-text-mini transition-all mb-2">
                        • {thought.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-[#b0b0b0]">
                        <span>{new Date(thought.date).toLocaleDateString()}</span>
                        <span className="text-accent">|</span>
                        <span>{thought.category}</span>
                      </div>
                      {thought.description && (
                        <p className="text-[#b0b0b0] mt-2 text-sm">{thought.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 p-8 border-t border-gray-800 relative z-10">
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
              angle = (angle + 0.5) % 360;
              requestAnimationFrame(draw);
            }
            draw();
          };
        })();
      `}} />

      {/* Custom Animations */}
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
        
        /* Animation definitions */
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
        
        .animate-glitch-text-mini {
          animation: glitchTextMini 3s infinite linear alternate-reverse;
        }
        @keyframes glitchTextMini {
          0% { text-shadow: 1px 0 #ff0044; }
          50% { text-shadow: -1px 0 #00fff7; }
          100% { text-shadow: 1px 0 #ff0044; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .favicon-spin {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
} 