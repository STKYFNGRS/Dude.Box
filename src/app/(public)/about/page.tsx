import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Dude.Box",
  description:
    "Dude.Box is a content platform delivering defense news, global conflict tracking, DIY projects, gear reviews, tactical content, and military history.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Image
            src="/Logo.png"
            alt="Dude.Box"
            width={200}
            height={56}
            className="mx-auto mb-8"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            About <span className="text-tactical-500">Dude.Box</span>
          </h1>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <div className="rounded-xl border border-panel-border bg-panel p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tactical-500" />
              What is Dude.Box?
            </h2>
            <p>
              Dude.Box is a content platform built for the informed, the
              curious, and the hands-on. We aggregate and produce quality content
              spanning defense news, global conflict analysis, DIY project
              guides, tactical gear reviews, training resources, and military
              history — all in one centralized hub.
            </p>
          </div>

          <div className="rounded-xl border border-panel-border bg-panel p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Our Mission
            </h2>
            <p>
              We believe every dude deserves access to quality, no-BS content
              about the world around them. Our mission is to cut through the
              noise and deliver actionable intelligence, honest reviews, and
              practical knowledge. Whether you&apos;re tracking global events,
              building something with your hands, or gearing up for the next
              adventure — we&apos;ve got you covered.
            </p>
          </div>

          <div className="rounded-xl border border-panel-border bg-panel p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tactical-500" />
              What We Cover
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[
                {
                  icon: "🛡️",
                  title: "Defense News",
                  desc: "Global military & security developments",
                },
                {
                  icon: "🌍",
                  title: "Global Conflicts",
                  desc: "Active zones, analysis & situational awareness",
                },
                {
                  icon: "🔧",
                  title: "DIY & Projects",
                  desc: "Builds, mods & hands-on guides",
                },
                {
                  icon: "🎒",
                  title: "Gear Reviews",
                  desc: "Honest breakdowns of tools & equipment",
                },
                {
                  icon: "⚔️",
                  title: "Tactical",
                  desc: "Training, preparedness & fieldcraft",
                },
                {
                  icon: "📜",
                  title: "History",
                  desc: "Military history, battles & hard lessons",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3 rounded-lg bg-panel-light"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-tactical-500/30 bg-gradient-to-br from-tactical-500/10 to-transparent p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-3">
              Built Different
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
              Dude.Box is powered by AI-assisted curation, real-time RSS
              aggregation, and an interactive global conflict map. This
              isn&apos;t another blog — it&apos;s your operational dashboard.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-tactical-500 text-white font-semibold rounded-lg hover:bg-tactical-600 transition-colors"
            >
              Explore Dude.Box
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
