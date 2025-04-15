'use client';

import dynamic from "next/dynamic";

// Import ThreeScene with dynamic import to avoid SSR issues
const ThreeScene = dynamic(() => import("@/components/ThreeScene"), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] flex items-center justify-center text-gray-300" style={{ background: 'transparent' }}>Loading 3D scene...</div>
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#111111] text-[#EDEDED] font-mono">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 shadow-lg bg-gradient-to-b from-[#181818] to-[#111111] z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/android-chrome-192x192.png" alt="D.U.D.E. Box Logo" className="h-14 w-14 drop-shadow-lg animate-spin-slow" />
          </div>
          <nav className="hidden md:flex space-x-8 text-lg">
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#mission" className="hover:text-accent transition-colors">Mission</a>
            <a href="#tech" className="hover:text-accent transition-colors">Tech</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
        {/* Futuristic Glitchy BG */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#2e2e2e33] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#ff004433] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-noise opacity-10 mix-blend-soft-light" />
        </div>

        {/* Hero Content */}
        <section className="relative z-10 flex flex-col items-center justify-center w-full pt-12 pb-8">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-center text-accent drop-shadow-lg animate-glitch">
              Welcome to
            </h1>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center text-white animate-glitch-subtle">
              Digital Underground
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-center text-accent animate-fade-in-slow">
              Design & Engineering
            </h3>
          </div>
          <p className="max-w-2xl text-center text-lg md:text-2xl text-[#b0b0b0] mt-4 mb-2 animate-fade-in">
            Where retro-future robots, nuclear powered alarm clocks, and <span className="text-accent">AI misfits </span> are born. 
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#about" className="px-6 py-3 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-opacity-80 transition-all animate-fade-in">Learn More</a>
            <a href="#contact" className="px-6 py-3 rounded-full border border-accent text-accent font-bold shadow-lg hover:bg-accent hover:text-white transition-all animate-fade-in">Contact</a>
          </div>

          {/* 3D Scene */}
          <div className="w-full flex justify-center mt-10 mb-2 animate-fade-in-slow">
            <div className="w-full max-w-3xl">
              <ThreeScene />
            </div>
          </div>
        </section>

        {/* Neon Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-accent via-[#ff0044] to-accent blur-sm opacity-70 my-8 animate-pulse" />

        {/* About Section */}
        <section id="about" className="relative z-10 flex flex-col items-center justify-center py-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-fade-in">What is D.U.D.E. Box?</h2>
          <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
            We are a post-apocalyptic robot foundry, creative lab, and high-tech misfit collective. We design, print, and engineer quirky, collectible robots, smart lamps, and interactive tech, right from our underground lair. Our mission: <span className="text-accent">bring joy, weirdness, and STEM inspiration to the world</span> — one glitched bot at a time.
          </p>
          <div className="flex flex-wrap gap-6 justify-center animate-fade-in-slow">
            <div className="bg-[#181818] border border-accent/40 rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center">
              <span className="text-4xl mb-2">🤖</span>
              <span className="font-bold text-lg mb-1 text-accent">Robots & Lamps</span>
              <span className="text-[#b0b0b0] text-center">Collectible, customizable, and always a little bit broken. Each bot tells a story.</span>
            </div>
            <div className="bg-[#181818] border border-accent/40 rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center">
              <span className="text-4xl mb-2">🧑‍🔬</span>
              <span className="font-bold text-lg mb-1 text-accent">Maker Culture</span>
              <span className="text-[#b0b0b0] text-center">3D printed, hand-finished, and open for hacking. DIY kits, live builds  and more.</span>
            </div>
            <div className="bg-[#181818] border border-accent/40 rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center">
              <span className="text-4xl mb-2">☢️</span>
              <span className="font-bold text-lg mb-1 text-accent">Nuclear Aesthetic</span>
              <span className="text-[#b0b0b0] text-center">Glowing, glitchy, and a little dangerous. Our bots will survive the end of the world.</span>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="relative z-10 flex flex-col items-center justify-center py-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-fade-in">Our Mission</h2>
          <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
            Engineer the future with attitude. We fuse robotics, AI, and unapologetic creativity to build the wildest tech on the planet—collectibles, gadgets, and bots with a soul. Whether a lamp with attitude, robot with a story, or a defense bot for the world of tomorrow, Dude is where underground ideas come to life. 
          </p>
        </section>

        {/* Tech Section */}
        <section id="tech" className="relative z-10 flex flex-col items-center justify-center py-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-fade-in">Tech & Tinkering</h2>
          <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
            We use 3D printers, chips, circuitry, sensors and imagination. Our bots are powered by open hardware, AI, and a love for all things weird. Want to see how it's made? <span className="text-accent">Watch our live 3D printing streams</span> (coming soon) or chat with our AI bot to design your own collectible.
          </p>
          <div className="flex flex-wrap gap-6 justify-center animate-fade-in-slow">
            <div className="bg-[#181818] border border-accent/40 rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center">
              <span className="text-4xl mb-2">🖨️</span>
              <span className="font-bold text-lg mb-1 text-accent">Live Printing</span>
              <span className="text-[#b0b0b0] text-center">Rent our 3D printer, watch your bot come to life on stream, and get it shipped to your bunker.</span>
            </div>
            <div className="bg-[#181818] border border-accent/40 rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center">
              <span className="text-4xl mb-2">🤝</span>
              <span className="font-bold text-lg mb-1 text-accent">Community Builds</span>
              <span className="text-[#b0b0b0] text-center">Join our Discord, vote on new designs, and help shape the next generation of bots.</span>
            </div>
            <div className="bg-[#181818] border border-accent/40 rounded-lg p-6 shadow-lg max-w-xs flex flex-col items-center">
              <span className="text-4xl mb-2">🧠</span>
              <span className="font-bold text-lg mb-1 text-accent">AI + Retro Tech</span>
              <span className="text-[#b0b0b0] text-center">Our bots combine AI with retro-futuristic designs to create something truly unique.</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative z-10 flex flex-col items-center justify-center py-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4 tracking-wider animate-fade-in">Contact & Collaborate</h2>
          <p className="max-w-2xl text-center text-lg md:text-xl text-[#b0b0b0] mb-6 animate-fade-in">
            Want to collaborate, join the team, or just say hi? Drop us a line. We love meeting fellow makers, dreamers, and survivors.
          </p>
          <a href="mailto:dude@dude.box" className="px-8 py-4 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-opacity-80 transition-all animate-fade-in">Email Us</a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 p-8 border-t border-gray-800 relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/android-chrome-192x192.png" alt="D.U.D.E. Box Logo" className="h-8 w-8 favicon-spin" />
            <span className="font-bold text-white">Dude Dot Box LLC</span>
            <span className="text-xs ml-2 px-2 py-1 bg-gray-800 rounded text-yellow-400 border border-yellow-700">Disabled Veteran Owned</span>
          </div>
          <div className="text-xs text-center md:text-right">
            &copy; {new Date().getFullYear()} D.U.D.E. Box. All rights reserved. <span className="text-accent">|</span> Built in the wasteland.
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
              angle = (angle + 0.5) % 360; // Slower spin to match header logo
              requestAnimationFrame(draw);
            }
            draw();
          };
        })();
      `}} />

      {/* Custom Animations */}
      <style jsx global>{`
        .text-accent { color: #ff0044; }
        .bg-accent { background: #ff0044; }
        .border-accent { border-color: #ff0044; }
        .animate-glitch {
          animation: glitch 2.5s infinite linear alternate-reverse;
        }
        .animate-glitch-subtle {
          animation: glitchSubtle 2.5s infinite linear alternate-reverse;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 #ff0044, -2px 0 #00fff7; }
          20% { text-shadow: -2px 2px #ff0044, 2px -2px #00fff7; }
          40% { text-shadow: 2px -2px #ff0044, -2px 2px #00fff7; }
          60% { text-shadow: 0 2px #ff0044, 0 -2px #00fff7; }
          80% { text-shadow: 2px 2px #ff0044, -2px -2px #00fff7; }
          100% { text-shadow: -2px 0 #ff0044, 2px 0 #00fff7; }
        }
        @keyframes glitchSubtle {
          0% { text-shadow: 1px 0 #ff0044, -1px 0 #00fff7; transform: translateX(0); }
          25% { text-shadow: -1px 1px #ff0044, 1px -1px #00fff7; transform: translateX(-2px); }
          50% { text-shadow: 1px -1px #ff0044, -1px 1px #00fff7; transform: translateX(2px); }
          75% { text-shadow: 0 1px #ff0044, 0 -1px #00fff7; transform: translateX(-1px); }
          100% { text-shadow: -1px 0 #ff0044, 1px 0 #00fff7; transform: translateX(0); }
        }
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
      `}</style>
    </div>
  );
}
