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
                We are a father son team who are running our own little robot foundry and creative lab. We design, print, and engineer quirky, collectible robots, smart lamps, and other interactive tech. 
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-slow">
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                <span className="text-4xl mb-2">🤖</span>
                  <span className="font-bold text-lg mb-1 text-accent">Robotic Creativity</span>
                  <span className="text-[#b0b0b0] text-center">Small-batch, artisan robot designs with personality and purpose. Each creation combines modern tech with retro-future aesthetics to create something truly one-of-a-kind.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">👨‍👦</span>
                  <span className="font-bold text-lg mb-1 text-accent">Father-Son Workshop</span>
                  <span className="text-[#b0b0b0] text-center">Teaching the next generation about electronics, design, and making. Building robots today to prepare for tomorrow's world, one circuit and line of code at a time.</span>
              </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🛠️</span>
                  <span className="font-bold text-lg mb-1 text-accent">Hands-On Engineering</span>
                  <span className="text-[#b0b0b0] text-center">3D printed, hand-finished, and open for hacking. DIY kits, interactive builds, and modular components designed for both beginners and advanced makers.</span>
              </div>
                <div className="card-box rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center animate-glitch-hover">
                <span className="text-4xl mb-2">☢️</span>
                  <span className="font-bold text-lg mb-1 text-accent">Post-Apocalyptic Vision</span>
                  <span className="text-[#b0b0b0] text-center">Glitchy, battle-worn aesthetics inspired by a world where robots continue their tasks long after humans have gone. Each creation tells a story from this alternate timeline.</span>
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
                  <span className="text-4xl mb-2">🔒</span>
                  <span className="font-bold text-lg mb-1 text-accent">Liquidity Lock</span>
                  <span className="text-[#b0b0b0] text-center">Initial liquidity pool locked.</span>
                </div>
                <div className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🔝</span>
                  <span className="font-bold text-lg mb-1 text-accent">Governance Rights</span>
                  <span className="text-[#b0b0b0] text-center">Shape the future of the Dude.Box ecosystem.</span>
          </div>
                <div className="card-box rounded-lg p-6 shadow-lg flex flex-col items-center animate-glitch-hover">
                  <span className="text-4xl mb-2">🔐</span>
                  <span className="font-bold text-lg mb-1 text-accent">Multi-Sig Vault</span>
                  <span className="text-[#b0b0b0] text-center">Stored Securely</span>
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
                Want to collaborate or just say hi? Drop us a line. We love meeting fellow makers, dreamers, and survivors.
              </p>
              <div className="flex flex-col items-center gap-6">
                
                {/* Social Media Icons */}
                <div className="flex flex-col items-center gap-4 mt-4"> {/* Changed to flex-col and adjusted gap */}
                  <div className="flex flex-wrap justify-center gap-6"> {/* First row */}
                    {/* Discord */}
                    <a href="https://discord.gg/suvXXNK4n3" target="_blank" rel="noopener noreferrer" className="social-icon-container group" aria-label="Join our Discord">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <div className="social-icon-glitch-effect"></div>
                    </a>
                    
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

                    {/* Facebook */}
                    <a href="https://www.facebook.com/profile.php?id=61568186610770" target="_blank" rel="noopener noreferrer" className="social-icon-container group" aria-label="Find us on Facebook">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12.061C22 6.505 17.523 2 12 2S2 6.505 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03h-2.54v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.908h-2.33V22c4.78-.755 8.437-4.917 8.437-9.939z"/>
                      </svg>
                      <div className="social-icon-glitch-effect"></div>
                    </a>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6"> {/* Second row */}
                    {/* Instagram */}
                    <a href="https://www.instagram.com/dudedotbox/" target="_blank" rel="noopener noreferrer" className="social-icon-container group" aria-label="Follow us on Instagram">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      <div className="social-icon-glitch-effect"></div>
                    </a>
                    
                    {/* YouTube */}
                    <a href="https://www.youtube.com/@dudedotbox" target="_blank" rel="noopener noreferrer" className="social-icon-container group" aria-label="Subscribe to our YouTube channel">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <div className="social-icon-glitch-effect"></div>
                    </a>
                    
                    {/* TikTok */}
                    <a href="https://www.tiktok.com/@dudedotbox" target="_blank" rel="noopener noreferrer" className="social-icon-container group" aria-label="Follow us on TikTok">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                      <div className="social-icon-glitch-effect"></div>
                    </a>
                    
                    {/* X (Twitter) */}
                    <a href="https://x.com/dudedotbox" target="_blank" rel="noopener noreferrer" className="social-icon-container group" aria-label="Follow us on X">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <div className="social-icon-glitch-effect"></div>
                    </a>
                  </div>
                  
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