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
              <a href="#projects" className={`transition-colors ${activeSection==='projects'?'text-accent font-bold animate-glitch-text-mini':''}`}>Projects</a>
              <a href="/token" className={`transition-colors ${activeSection==='token'?'text-accent font-bold animate-glitch-text-mini':''}`}>Token</a>
              <a href="/shop" className={`transition-colors ${activeSection==='shop'?'text-accent font-bold animate-glitch-text-mini':''}`}>Shop</a>
              <a href="/thoughts" className={`transition-colors ${activeSection==='thoughts'?'text-accent font-bold animate-glitch-text-mini':''}`}>Thoughts</a>
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
                  Robot Foundry & Creative Lab
            </h3>
          </div>
              <p className="max-w-2xl text-center text-lg md:text-2xl text-[#b0b0b0] mt-4 mb-2 animate-fade-in">
                A Father-Son Workshop for Robots & 
              </p>
               <p className="max-w-2xl text-center text-lg md:text-2xl text-[#b0b0b0] mt-4 mb-2 animate-fade-in">
                 Other <span className="text-accent animate-glitch-text-mini">Fun</span> tech things.
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
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-glitch-text-subtle text-center">Our Story</h2>
              <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
                Just a dad and his little dude making cool stuff together. This site is our digital playground and place to share the weird and wonderful things we create.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-slow">
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                <span className="text-4xl mb-2">🤖</span>
                  <span className="font-bold text-lg mb-1 text-accent">Robot Buddies</span>
                  <span className="text-[#b0b0b0] text-center">We design quirky robot companions with personality. Sometimes they work, sometimes they don't—but we always have fun building them!</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">👨‍👦</span>
                  <span className="font-bold text-lg mb-1 text-accent">Learning Together</span>
                  <span className="text-[#b0b0b0] text-center">Each project is a chance for us to learn something new—from coding and circuits to crypto and 3D modeling. Dad teaches son, son teaches dad.</span>
              </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🎮</span>
                  <span className="font-bold text-lg mb-1 text-accent">Gaming & Making</span>
                  <span className="text-[#b0b0b0] text-center">When we're not building robots, we're gaming or printing stuff. Sometimes our best ideas come from "what if we combined these games we love?"</span>
              </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                <span className="text-4xl mb-2">☢️</span>
                  <span className="font-bold text-lg mb-1 text-accent">Post-Apocalyptic Vibe</span>
                  <span className="text-[#b0b0b0] text-center">We share a weird fascination with dystopian aesthetics, glitchy tech, battle-worn robots, and the strange beauty of a world reclaimed by nature and machines.</span>
                </div>
            </div>
          </div>
        </section>

          {/* Projects Section - New section */}
          <section id="projects" className="h-screen snap-always snap-start flex flex-col items-center justify-center py-12 px-4">
            <div className="section-box p-8 rounded-md max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-glitch-text-subtle text-center">Current Projects</h2>
              <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
                Check out our digital ventures and experimental platforms
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-slow">
                {/* Trivia Box */}
                <a href="https://www.trivia.box" target="_blank" rel="noopener noreferrer" className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <div className="favicon-container mb-3">
                    <img src="https://www.google.com/s2/favicons?domain=trivia.box&sz=64" 
                         alt="trivia.box favicon" 
                         className="w-12 h-12 object-contain" 
                         onError={(e) => {
                           e.currentTarget.src = "/placeholder-favicon.png";
                           e.currentTarget.onerror = null;
                         }} />
                  </div>
                  <span className="font-bold text-lg mb-1 text-accent">trivia.box</span>
                  <span className="text-[#b0b0b0] text-center">Interactive trivia games with a post-apocalyptic twist</span>
                </a>
                
                {/* MMA Box */}
                <a href="https://www.mma.box" target="_blank" rel="noopener noreferrer" className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <div className="favicon-container mb-3">
                    <img src="https://www.google.com/s2/favicons?domain=mma.box&sz=64" 
                         alt="mma.box favicon" 
                         className="w-12 h-12 object-contain" 
                         onError={(e) => {
                           e.currentTarget.src = "/placeholder-favicon.png";
                           e.currentTarget.onerror = null;
                         }} />
                  </div>
                  <span className="font-bold text-lg mb-1 text-accent">mma.box</span>
                  <span className="text-[#b0b0b0] text-center">Mixed martial arts content and interactive fight guides</span>
                </a>
                
                {/* Wrestling Box */}
                <a href="https://www.wrestling.box" target="_blank" rel="noopener noreferrer" className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <div className="favicon-container mb-3">
                    <img src="https://www.google.com/s2/favicons?domain=wrestling.box&sz=64" 
                         alt="wrestling.box favicon" 
                         className="w-12 h-12 object-contain" 
                         onError={(e) => {
                           e.currentTarget.src = "/placeholder-favicon.png";
                           e.currentTarget.onerror = null;
                         }} />
                  </div>
                  <span className="font-bold text-lg mb-1 text-accent">wrestling.box</span>
                  <span className="text-[#b0b0b0] text-center">Pro wrestling events, stats, and fan connection platform</span>
                </a>
                
                {/* Fart Box */}
                <a href="https://www.fart.box" target="_blank" rel="noopener noreferrer" className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <div className="favicon-container mb-3">
                    <img src="https://fart.box/favicon.ico" 
                         alt="fart.box favicon" 
                         className="w-12 h-12 object-contain" 
                         onError={(e) => {
                           e.currentTarget.src = "/placeholder-favicon.png";
                           e.currentTarget.onerror = null;
                         }} />
                  </div>
                  <span className="font-bold text-lg mb-1 text-accent">fart.box</span>
                  <span className="text-[#b0b0b0] text-center">Quirky sound effects and novelty digital collectibles</span>
                </a>
              </div>
            </div>
          </section>

          {/* Token Section - LittleDude (SON) */}
          <section id="token" className="h-screen snap-always snap-start flex flex-col items-center justify-center py-12 px-4">
            <div className="section-box p-8 rounded-md max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-glitch-text-subtle text-center">LittleDude (SON) Token</h2>
              <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
                Our ecosystem token powering the future of Dude.Box
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-slow mb-6">
                <div className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">💰</span>
                  <span className="font-bold text-lg mb-1 text-accent">Token Supply</span>
                  <span className="text-[#b0b0b0] text-center">Total supply of 99,000,000 SON tokens.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🛡️</span>
                  <span className="font-bold text-lg mb-1 text-accent">No Rug Risk</span>
                  <span className="text-[#b0b0b0] text-center">No treasury or large reserves that could be dumped.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🔥</span>
                  <span className="font-bold text-lg mb-1 text-accent">Deflationary</span>
                  <span className="text-[#b0b0b0] text-center">1% burn on every transaction reduces supply over time.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🔒</span>
                  <span className="font-bold text-lg mb-1 text-accent">Liquidity Locked</span>
                  <span className="text-[#b0b0b0] text-center">LP locked until August 5th, 2039</span>
                </div>
              </div>

              <div className="flex justify-center">
                <a href="/token" className="px-6 py-3 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-opacity-80 transition-all animate-fade-in animate-glitch-hover text-lg">Get Some, SON</a>
            </div>
          </div>
        </section>

          {/* Shop Section - New section for featured products */}
          <ShopSection />

          {/* Contact Section - Reverted height back to h-screen */}
          <section id="contact" className="h-screen snap-always snap-start flex flex-col items-center justify-center py-12 px-4 pb-24 relative">
            <div className="section-box p-8 rounded-md max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-glitch-text-subtle text-center">Contact & Collaborate</h2>
              <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
                Want to collaborate or just say hi? Drop us a line. We love meeting fellow makers and dreamers.
              </p>
              <div className="flex flex-col items-center gap-6">
                
                {/* Social Media Icons */}
                <div className="flex flex-wrap justify-center gap-6 mt-4">
                  {/* Zora */}
                  <a href="https://zora.co/@dudedotbox" target="_blank" rel="noopener noreferrer" className="social-icon-container group" aria-label="Find us on Zora">
                    <img 
                      src="/zora.png" 
                      alt="Zora" 
                      className="w-6 h-6 object-cover transition-all duration-300" 
                    />
                    <div className="social-icon-glitch-effect"></div>
                  </a>

                  {/* Email */}
                  <a href="mailto:dude@dude.box" className="social-icon-container group" aria-label="Email us">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                    </svg>
                    <div className="social-icon-glitch-effect"></div>
                  </a>
                </div>
              </div>
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
          
          /* Social media icon styles */
          .social-icon-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .social-icon-container:hover {
            transform: scale(1.1);
          }
          
          .social-icon-container:hover:before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #ff0044, #00fff7);
            z-index: -1;
            animation: glitchBorder 2s linear infinite;
          }
          
          .social-icon-container:hover:after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: -1;
          }
          
          .social-icon-circle {
            position: absolute;
            inset: 0;
            display: block;
            border-radius: 50%;
            transition: all 0.3s ease;
          }
          
          .social-icon-container:hover .social-icon-circle {
            border: 1px solid #ff0044;
            box-shadow: 0 0 10px rgba(255, 0, 68, 0.5), 0 0 15px rgba(0, 255, 247, 0.3);
            animation: glitchBorder 2s linear infinite;
          }
          
          .zora-symbol {
            font-size: 14px;
            z-index: 10;
          }
          
          .zora-orb {
            filter: drop-shadow(0px 0px 8px rgba(136, 96, 241, 0.5));
            transition: all 0.3s ease;
          }
          
          .social-icon-container:hover .zora-orb {
            filter: drop-shadow(0px 0px 12px rgba(255, 0, 68, 0.7));
            fill: #ff0044;
          }
          
          .zora-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            overflow: visible;
          }
          
          .zora-icon {
            position: absolute;
            inset: 0;
            transition: all 0.3s ease;
            filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5));
            width: 32px;
            height: 32px;
            object-fit: contain;
          }
          
          @keyframes glitchBorder {
            0% {
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
            20% {
              clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%);
            }
            40% {
              clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
            }
            60% {
              clip-path: polygon(5% 0, 100% 0, 100% 95%, 0 100%);
            }
            80% {
              clip-path: polygon(0 0, 95% 0, 100% 100%, 5% 100%);
            }
            100% {
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
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
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-30 md:hidden">
          <div className="flex flex-col items-center h-full space-y-8 text-2xl pt-32">
            <a 
              href="#about" 
              className={`transition-colors p-4 ${activeSection==='about'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
              onClick={handleNavClick}
            >
              About
            </a>
            <a 
              href="#projects" 
              className={`transition-colors p-4 ${activeSection==='projects'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
              onClick={handleNavClick}
            >
              Projects
            </a>
            <a 
              href="/token" 
              className={`transition-colors p-4 ${activeSection==='token'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
              onClick={handleNavClick}
            >
              Token
            </a>
            <a 
              href="/shop" 
              className={`transition-colors p-4 ${activeSection==='shop'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
              onClick={handleNavClick}
            >
              Shop
            </a>
            <a 
              href="/thoughts" 
              className={`transition-colors p-4 ${activeSection==='thoughts'?'text-accent font-bold animate-glitch-text-mini':'text-white'}`}
              onClick={handleNavClick}
            >
              Thoughts
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