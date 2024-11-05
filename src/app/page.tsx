import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen justify-center p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-black">
      <main className="flex flex-col items-center">
        {/* Mobile-styled "DUDE" box logo fixed for all screens */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 200 100" 
          width="200" 
          height="100" 
          style={{ maxWidth: "200px", maxHeight: "100px" }} // Ensures fixed size
          className="absolute-center" // Helper class to center it as per mobile
        >
          <g transform="translate(40, 20)">
            <rect x="0" y="0" width="120" height="50" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <text x="60" y="40" fontFamily="Arial" fontWeight="900" fontSize="40" textAnchor="middle">
              <tspan fill="#FFFFFF">DUDE</tspan>
            </text>
          </g>
        </svg>
      </main>

      <footer className="mt-8">
        <p className="text-center text-sm text-gray-400">
          Made with ❤️ by dude dot box LLC. &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
      
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
