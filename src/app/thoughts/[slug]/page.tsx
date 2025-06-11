'use client';

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MatrixRain from "@/components/MatrixRain";
import CartIcon from "@/components/CartIcon";

interface ThoughtData {
  title: string;
  date: string;
  category: string;
  content?: string;
  image?: string;
  pdf?: string;
  description?: string;
}

export default function ThoughtPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [thought, setThought] = useState<ThoughtData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;

    async function loadThought() {
      try {
        const response = await fetch(`/api/thoughts/${slug}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else if (data.thought) {
          setThought(data.thought);
        }
      } catch (err) {
        console.error('Failed to load thought:', err);
        setError('Failed to load thought. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadThought();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col text-[#EDEDED] font-mono bg-black">
        <MatrixRain />
        <div className="flex-1 flex items-center justify-center">
          <div className="section-box p-8 rounded-md">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-64 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !thought) {
    return (
      <div className="min-h-screen flex flex-col text-[#EDEDED] font-mono bg-black">
        <MatrixRain />
        <div className="flex-1 flex items-center justify-center">
          <div className="section-box p-8 rounded-md text-center">
            <h1 className="text-2xl font-bold text-accent mb-4">Thought Not Found</h1>
            <p className="text-[#b0b0b0] mb-6">{error || 'The thought you\'re looking for doesn\'t exist.'}</p>
            <a href="/thoughts" className="px-6 py-3 bg-accent text-white rounded-md hover:bg-opacity-80 transition-all">
              Back to Thoughts
            </a>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Thought Content */}
      <main className="pt-32 pb-16 px-4 md:px-8 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {/* Back to Thoughts link */}
          <div className="mb-6">
            <a 
              href="/thoughts" 
              className="inline-flex items-center text-accent hover:animate-glitch-text-mini transition-all"
            >
              ← Back to Thoughts
            </a>
          </div>

          {/* Article Header */}
          <div className="section-box p-8 rounded-md mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-accent drop-shadow-lg animate-glitch-subtle mb-4">
              {thought.title}
            </h1>
            <div className="flex items-center gap-4 text-[#b0b0b0] mb-4">
              <span>{new Date(thought.date).toLocaleDateString()}</span>
              <span className="text-accent">|</span>
              <span>{thought.category}</span>
            </div>
            {thought.description && (
              <p className="text-[#b0b0b0] text-lg">{thought.description}</p>
            )}
          </div>

          {/* Dynamic Content Sections */}
          <div className="space-y-8">
            {/* Image Section - Only shows if image exists */}
            {thought.image && (
              <div className="section-box p-6 rounded-md">
                <div className="flex justify-center">
                  <img 
                    src={thought.image} 
                    alt={thought.title}
                    className="max-w-full h-auto rounded-md border border-gray-700 shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Article Content Section - Only shows if content exists */}
            {thought.content && (
              <div className="section-box p-8 rounded-md">
                <div 
                  className="prose prose-invert max-w-none text-[#EDEDED] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: thought.content }}
                />
              </div>
            )}

            {/* PDF Section - Only shows if PDF exists */}
            {thought.pdf && (
              <div className="section-box p-6 rounded-md">
                <h3 className="text-xl font-bold text-accent mb-4">Document</h3>
                <div className="border border-gray-700 rounded-md p-4 bg-black/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-accent text-2xl">📄</div>
                      <div>
                        <p className="font-bold text-white">Document</p>
                        <p className="text-sm text-[#b0b0b0]">PDF File</p>
                      </div>
                    </div>
                    <a 
                      href={thought.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-accent text-white rounded-md hover:bg-opacity-80 transition-all font-bold shadow-lg animate-glitch-hover"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
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

      {/* Custom Styles */}
      <style jsx global>{`
        /* Prose styling for article content */
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #ff0044;
          font-weight: bold;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        
        .prose p {
          margin-bottom: 1.5em;
          line-height: 1.7;
        }
        
        .prose strong {
          color: #ffffff;
          font-weight: bold;
        }
        
        .prose em {
          color: #ff0044;
          font-style: italic;
        }
        
        .prose ul, .prose ol {
          margin: 1.5em 0;
          padding-left: 2em;
        }
        
        .prose li {
          margin-bottom: 0.5em;
        }
        
        .prose blockquote {
          border-left: 4px solid #ff0044;
          padding-left: 1.5em;
          margin: 2em 0;
          font-style: italic;
          color: #b0b0b0;
        }
        
        .prose code {
          background: rgba(255, 0, 68, 0.1);
          color: #ff0044;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Geist Mono', monospace;
        }
        
        .prose pre {
          background: #111111;
          border: 1px solid #333;
          padding: 1.5em;
          border-radius: 6px;
          overflow-x: auto;
          margin: 2em 0;
        }
        
        .prose pre code {
          background: none;
          padding: 0;
          color: #EDEDED;
        }
        
        .prose a {
          color: #ff0044;
          text-decoration: underline;
          transition: all 0.3s ease;
        }
        
        .prose a:hover {
          color: #00fff7;
          text-decoration: none;
          text-shadow: 0 0 5px #00fff7;
        }

        /* Section and card styling to match header */
        .section-box {
          background: linear-gradient(to bottom, #181818, #111111);
          border: 1px solid #222;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 5;
        }
        
        /* Color definitions */
        .text-accent { color: #ff0044; }
        .bg-accent { background: #ff0044; }
        .border-accent { border-color: #ff0044; }
        
        /* Animation definitions */
        .animate-glitch-subtle {
          animation: glitchSubtle 2.5s infinite linear alternate-reverse;
        }
        @keyframes glitchSubtle {
          0% { text-shadow: 1px 0 #ff0044, -1px 0 #00fff7; transform: translateX(0); }
          25% { text-shadow: -1px 1px #ff0044, 1px -1px #00fff7; transform: translateX(-1px); }
          50% { text-shadow: 1px -1px #ff0044, -1px 1px #00fff7; transform: translateX(1px); }
          75% { text-shadow: -1px 0 #ff0044, 1px 0 #00fff7; transform: translateX(0); }
          100% { text-shadow: 1px 0 #ff0044, -1px 0 #00fff7; transform: translateX(0); }
        }
        
        .animate-glitch-text-mini {
          animation: glitchTextMini 3s infinite linear alternate-reverse;
        }
        @keyframes glitchTextMini {
          0% { text-shadow: 1px 0 #ff0044; }
          50% { text-shadow: -1px 0 #00fff7; }
          100% { text-shadow: 1px 0 #ff0044; }
        }
        
        .animate-glitch-hover:hover {
          animation: glitchHover 0.3s linear;
        }
        @keyframes glitchHover {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
          100% { transform: translateX(0); }
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