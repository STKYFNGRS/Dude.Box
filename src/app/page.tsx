'use client';

import React, { useState, useEffect } from "react";
import MatrixRain from "@/components/MatrixRain";
import ShopSection from "@/components/ShopSection";
import CartIcon from "@/components/CartIcon";

export default function Home() {
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
        {/* Matrix-style rain overlay - RESTORED */}
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
              <a href="#about" className={`transition-colors ${activeSection==='about'?'text-accent font-bold animate-glitch-text-mini':''}`}>About</a>
              <a href="#shop" className={`transition-colors ${activeSection==='shop'?'text-accent font-bold animate-glitch-text-mini':''}`}>Shop</a>
              <a href="#tech" className={`transition-colors ${activeSection==='tech'?'text-accent font-bold animate-glitch-text-mini':''}`}>Tech</a>
              <a href="#contact" className={`transition-colors ${activeSection==='contact'?'text-accent font-bold animate-glitch-text-mini':''}`}>Contact</a>
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

        {/* Reverted main height back to h-screen for scroll snapping */}
        <main className="h-screen snap-mandatory snap-y overflow-y-auto no-scrollbar pt-16 relative z-10">
          {/* Hero Section - Reverted height back to h-screen */}
          <section id="hero" className="h-screen snap-always snap-start flex flex-col items-center justify-center w-full">
            <div className="section-box p-8 rounded-md max-w-3xl text-center">
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-center text-accent drop-shadow-lg animate-glitch">
                  Welcome to
                </h1>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center text-white animate-glitch-subtle">
                  Dude.Box
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-center text-accent animate-fade-in-slow">
                  Robot Foundry, Smart Collectibles & DIY Kits
                </h3>
              </div>
              <p className="max-w-2xl text-center text-lg md:text-2xl text-[#b0b0b0] mt-4 mb-2 animate-fade-in">
                A Father-Son Workshop for Robots & 
              </p>
               <p className="max-w-2xl text-center text-lg md:text-2xl text-[#b0b0b0] mt-4 mb-2 animate-fade-in">
                 Other <span className="text-accent animate-glitch-text-mini">Fun Tech</span> things.
              </p>
              <div className="flex gap-4 mt-2 justify-center">
                <a href="#about" className="px-6 py-3 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-opacity-80 transition-all animate-fade-in animate-glitch-hover">Learn More</a>
                <a href="#contact" className="px-6 py-3 rounded-full border border-accent text-accent font-bold shadow-lg hover:bg-accent hover:text-white transition-all animate-fade-in animate-glitch-hover">Contact</a>
              </div>
            </div>
          </section>

          {/* About Section - Reverted height back to h-screen */}
          <section id="about" className="h-screen snap-always snap-start flex flex-col items-center justify-center py-12 px-4">
            <div className="section-box p-8 rounded-md max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-glitch-text-subtle text-center">What it is, Dude.</h2>
              <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
                We are a father son team who are running our own little robot foundry, creative lab, and high-tech misfit collective. We design, print, and engineer quirky, collectible robots, smart lamps, and other interactive tech, right from our underground lair. Our mission: <span className="text-accent animate-glitch-text-mini">bring joy, weirdness, and STEM inspiration to the world</span> — one glitched bot at a time.
              </p>
              
              <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
                My son's love for robots inspired this journey. I believe these projects will kickstart his imagination and prepare him for a future where robotics is everywhere. Teaching kids today how to build, use, and repair robots is <span className="text-accent animate-glitch-text-mini">critically important</span> for tomorrow's world. Through hands-on creation, we're learning together while building something unique.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-slow">
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🤖</span>
                  <span className="font-bold text-lg mb-1 text-accent">Robots & Lamps</span>
                  <span className="text-[#b0b0b0] text-center">Collectible, customizable, and always a little bit broken. Each bot tells a story.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🧑‍🔬</span>
                  <span className="font-bold text-lg mb-1 text-accent">Maker Culture</span>
                  <span className="text-[#b0b0b0] text-center">3D printed, hand-finished, and open for hacking. DIY kits, live builds  and more.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center md:col-span-2 mx-auto animate-glitch-hover">
                  <span className="text-4xl mb-2">☢️</span>
                  <span className="font-bold text-lg mb-1 text-accent">Nuclear Aesthetic</span>
                  <span className="text-[#b0b0b0] text-center">Glowing, glitchy, and slightly unhinged. The aesthetics of tomorrow as imagined yesterday, built today.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Shop Section - New section for featured products */}
          <ShopSection />

          {/* Tech Section - Reverted height back to h-screen */}
          <section id="tech" className="h-screen snap-always snap-start flex flex-col items-center justify-center py-12 px-4">
            <div className="section-box p-8 rounded-md max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-glitch-text-subtle text-center">Tech & Tinkering</h2>
              <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
                We transform 3D filament, circuitry, and caffeine-fueled coding sessions into objects with personality. The secret sauce? Open hardware designs, questionable decision-making, and our pathological need to make inanimate objects talk back. <span className="text-accent animate-glitch-text-mini">Want a front-row seat to the chaos?</span> Tune into our live 3D printing streams (coming soon) or collaborate with our AI to birth your own mechanical offspring.
              </p>
              <div className="flex flex-wrap gap-6 justify-center animate-fade-in-slow">
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🖨️</span>
                  <span className="font-bold text-lg mb-1 text-accent">Live Printing</span>
                  <span className="text-[#b0b0b0] text-center">Rent our 3D printer, watch your bot come to life on stream, and get it shipped to your bunker.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🤝</span>
                  <span className="font-bold text-lg mb-1 text-accent">Community Builds</span>
                  <span className="text-[#b0b0b0] text-center">Join our Discord, vote on new designs, and help shape the next generation of bots.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🧠</span>
                  <span className="font-bold text-lg mb-1 text-accent">AI + Retro Tech</span>
                  <span className="text-[#b0b0b0] text-center">Our bots combine AI with retro-futuristic designs to create something truly unique.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section - Reverted height back to h-screen */}
          <section id="contact" className="h-screen snap-always snap-start flex flex-col items-center justify-center py-12 px-4 pb-24 relative">
            <div className="section-box p-8 rounded-md max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-glitch-text-subtle text-center">Contact & Collaborate</h2>
              <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
                Want to collaborate, join the team, or just say hi? Drop us a line. We love meeting fellow makers, dreamers, and survivors.
              </p>
              <a href="mailto:dude@dude.box" className="px-8 py-4 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-opacity-80 transition-all animate-fade-in animate-glitch-hover">Email Us</a>
            </div>
          </section>
        </main>

        {/* Footer - Only visible when on contact section */}
        <footer className={`bg-black text-gray-400 p-8 border-t border-gray-800 fixed bottom-0 left-0 right-0 z-10 transform transition-transform duration-300 ${activeSection === 'contact' ? 'translate-y-0' : 'translate-y-full'}`}>
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

        {/* Scripts and Styles */}
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
            
            /* Reduce heading sizes further */
            h1 { font-size: 2.2rem; line-height: 1.2; } 
            h2 { font-size: 1.8rem; line-height: 1.3; margin-bottom: 0.75rem; } /* Reduced margin */
            h3 { font-size: 1.5rem; line-height: 1.3; }
            
            /* Reduce paragraph text size and line height */
            p, .text-lg { font-size: 0.95rem; line-height: 1.5; } /* Adjusted base text */
            .text-xl { font-size: 1rem; line-height: 1.5; }
            .text-2xl { font-size: 1.1rem; line-height: 1.5; }

            /* Adjust hero button sizes */
            .hero-button {
               padding: 0.6rem 1.2rem; /* Smaller padding */
               font-size: 0.9rem; /* Smaller font */
            }
            
            /* Adjust card sizes and content */
            .card-box {
              padding: 1rem; /* Reduced padding */
              max-width: 90%; /* Allow cards to take more width */
              margin-left: auto;
              margin-right: auto;
            }
            .card-box span:first-child { font-size: 2rem; margin-bottom: 0.25rem; } /* Smaller icon */
            .card-box .font-bold { font-size: 1rem; margin-bottom: 0.25rem; } /* Smaller title */
            .card-box .text-\\[\\#b0b0b0\\] { font-size: 0.85rem; line-height: 1.4; } /* Smaller description */

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
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`fixed inset-0 bg-black z-30 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden`}>
        <div className="flex flex-col items-center h-full space-y-8 text-2xl pt-32">
          <a 
            href="#about" 
            className={`transition-colors p-4 ${activeSection==='about'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
            onClick={handleNavClick}
          >
            About
          </a>
          <a 
            href="#shop" 
            className={`transition-colors p-4 ${activeSection==='shop'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
            onClick={handleNavClick}
          >
            Shop
          </a>
          <a 
            href="#tech" 
            className={`transition-colors p-4 ${activeSection==='tech'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
            onClick={handleNavClick}
          >
            Tech
          </a>
          <a 
            href="#contact" 
            className={`transition-colors p-4 ${activeSection==='contact'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
            onClick={handleNavClick}
          >
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
