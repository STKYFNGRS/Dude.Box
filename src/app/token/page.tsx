'use client';

import React, { useState, useEffect } from "react";
import MatrixRain from "@/components/MatrixRain";
import CartIcon from "@/components/CartIcon";
import TokenVestingSchedule from "@/components/TokenVestingSchedule";
import TokenRoadmap from "@/components/TokenRoadmap";
import TokenPurchaseInterface from "@/components/TokenPurchaseInterface";

export default function TokenPage() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Scroll spy: track which section is in view
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { root: null, threshold: 0.6 });
    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu when clicking a nav item
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <> {/* Use a Fragment to return multiple top-level elements */}
      {/* Main Content Container */}
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
              <a href="/#about" className={`transition-colors ${activeSection==='about'?'text-accent font-bold animate-glitch-text-mini':''}`}>About</a>
              <a href="/#projects" className={`transition-colors ${activeSection==='about'?'text-accent font-bold animate-glitch-text-mini':''}`}>Projects</a>
              <a href="/token" className="transition-colors text-accent font-bold animate-glitch-text-mini">Token</a>
              <a href="/shop" className={`transition-colors ${activeSection==='shop'?'text-accent font-bold animate-glitch-text-mini':''}`}>Shop</a>
              <a href="/thoughts" className={`transition-colors ${activeSection==='thoughts'?'text-accent font-bold animate-glitch-text-mini':''}`}>Thoughts</a>
              <a href="/#contact" className={`transition-colors ${activeSection==='contact'?'text-accent font-bold animate-glitch-text-mini':''}`}>Contact</a>
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

        <main className="pt-24 pb-32 px-4 md:px-8 relative z-10">
          {/* Token Page Content */}
          <div className="container mx-auto">
            <div className="section-box p-8 rounded-md max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-accent mb-6 tracking-wider animate-glitch-text-subtle text-center">
                LittleDude (SON) Token
              </h1>
              
              <p className="max-w-3xl mx-auto text-center text-lg md:text-xl text-[#b0b0b0] mb-8 animate-fade-in">
                Our ecosystem token powering the future of Dude.Box collectibles and experiences.
              </p>

              {/* Token Content Goes Here */}
              <div className="space-y-10">
                <TokenPurchaseInterface />
                <TokenRoadmap />
                <TokenVestingSchedule />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black text-gray-400 p-8 border-t border-gray-800 fixed bottom-0 left-0 right-0 z-10">
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

        {/* Favicon Spinner Script (Copied from src/app/page.tsx) */}
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
                angle = (angle + 0.5) % 360; // Slower spin
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
          
          /* Other animations */
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
        `}</style>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-30 md:hidden">
          <div className="flex flex-col items-center h-full space-y-8 text-2xl pt-32">
            <a 
              href="/#about" 
              className="transition-colors p-4 text-white"
              onClick={handleNavClick}
            >
              About
            </a>
            <a 
              href="/token" 
              className="transition-colors p-4 text-accent font-bold animate-glitch-text-mini"
              onClick={handleNavClick}
            >
              Token
            </a>
            <a 
              href="/shop" 
              className="transition-colors p-4 text-white"
              onClick={handleNavClick}
            >
              Shop
            </a>
            
            <a 
              href="/#contact" 
              className="transition-colors p-4 text-white"
              onClick={handleNavClick}
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
    </>
  );
}