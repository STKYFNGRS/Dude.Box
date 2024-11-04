import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
          <g transform="translate(40, 20)">
            <rect x="0" y="0" width="120" height="50" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <text x="60" y="40" fontFamily="Arial" fontWeight="900" fontSize="40" textAnchor="middle">
              <tspan fill="#FFFFFF">DUDE</tspan>
            </text>
          </g>
        </svg>
      </main>

      <footer className="row-start-2">
        <p>
          Made with ❤️ by dude dot box LLC. &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
      <Analytics />
    </div>
  );
}
