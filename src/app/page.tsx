import { Analytics } from "@vercel/analytics/react";


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
          style={{ display: "block" }} // Prevents scaling issues
        >
          <rect 
            x="10" 
            y="20" 
            width="180" 
            height="60" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
          />
          <text 
            x="100" 
            y="55" 
            fontFamily="Arial" 
            fontWeight="900" 
            fontSize="54" 
            textAnchor="middle" 
            fill="#FFFFFF"
            dominantBaseline="middle"
          >
            DUDE
          </text>
        </svg>
      </main>

      <footer className="mt-8">
        <p className="text-center text-sm text-gray-400">
          Made with ❤️ by dude dot box LLC. &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
      <Analytics />
    </div>
  );
}
