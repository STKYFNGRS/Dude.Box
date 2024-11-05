import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen justify-center p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-black">
      <main className="flex flex-col items-center">
        {/* Updated SVG with the provided code */}
        <svg 
          id="Layer_1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 595.28 841.89" 
          version="1.1" 
          width="200" 
          height="100"
          style={{ display: "block" }}
        >
          <defs>
            <style>
              {`
                .st0 {
                  fill: none;
                  stroke-width: 8px;
                }
                .st0, .st1 {
                  stroke: #fff;
                  stroke-miterlimit: 10;
                }
                .st1 {
                  fill: #fff;
                  font-family: 'Agency FB', sans-serif;
                  font-size: 124.87px;
                  stroke-width: 12px;
                }
              `}
            </style>
          </defs>
          <rect className="st0" x="87.13" y="293.22" width="421.02" height="131.08"/>
          <text className="st1" transform="translate(90.6 406.73) scale(1.98 1)">
            <tspan x="0" y="0">DUDE</tspan>
          </text>
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
