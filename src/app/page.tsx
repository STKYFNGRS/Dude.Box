import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dude.Box | Marketplace for Makers",
  description:
    "A marketplace where skilled craftsmen sell quality products. Get your own storefront, connect your payment account, and reach customers who value craftsmanship.",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <Container className="py-12">
      {/* Show banner for logged-in users */}
      {session?.user?.email && (
        <div className="mb-8 card rounded-lg p-6 border-accent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Welcome back, {session.user.name || "there"}!
              </h2>
              <p className="text-sm text-muted-foreground">
                Ready to check your dashboard?
              </p>
            </div>
            <Link
              href="/members"
              className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em]"
            >
              Go to Dashboard →
            </Link>
          </div>
        </div>
      )}
      <section className="pb-16 border-b border-border animate-fade-in">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="flex flex-col gap-8">
            <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
              Marketplace for Makers
            </span>
            <h1 className="section-title text-5xl md:text-7xl leading-tight bg-gradient-to-br from-foreground to-muted bg-clip-text text-transparent">
              Sell Your Craft. We Handle the Tech.
            </h1>
            <p className="text-xl text-muted max-w-2xl leading-relaxed">
              A platform where skilled makers can create branded storefronts, connect their payment accounts, 
              and sell quality products - without managing the tech stack.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/members/become-vendor"
                className="solid-button rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] w-full sm:w-auto text-center font-bold shadow-button hover:shadow-glow transition-all"
              >
                Become a Vendor →
              </a>
              <a
                href="/stores"
                className="outline-button rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] w-full sm:w-auto text-center border-2 border-accent text-accent font-semibold"
              >
                Browse Stores
              </a>
            </div>
          </div>
          <div className="card-hover rounded-2xl p-8 border-2 border-border shadow-card">
            <div className="aspect-[4/5] rounded-xl border-2 border-accent/20 bg-gradient-to-br from-panel to-background relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted font-semibold">
                  Storefront preview
                </span>
              </div>
            </div>
            <div className="pt-5 text-center">
              <p className="text-sm text-accent font-medium">yourstore.dude.box</p>
              <p className="text-xs text-muted mt-1">Your own branded storefront</p>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="py-16 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl pb-12 animate-fade-in">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">The Platform</span>
          <h2 className="section-title text-4xl md:text-5xl leading-tight">Built for makers who want to focus on making.</h2>
          <p className="text-xl text-muted leading-relaxed">
            You create quality products. We provide the storefront, payment processing, 
            hosting, and customer support. Keep 99% of every sale.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-hover rounded-lg p-8 group">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏪</span>
            </div>
            <h3 className="section-title text-xl mb-3 group-hover:text-accent transition-colors">Your Own Storefront</h3>
            <p className="text-sm text-muted leading-relaxed">
              Get a custom subdomain (yourstore.dude.box), branded pages, and email address. 
              Your brand, your products, your way.
            </p>
          </div>
          <div className="card-hover rounded-lg p-8 group">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="section-title text-xl mb-3 group-hover:text-accent transition-colors">Direct Payments</h3>
            <p className="text-sm text-muted leading-relaxed">
              Connect your Stripe account and receive payouts in 2 days. 
              We never hold your funds. You keep 99% of each sale.
            </p>
          </div>
          <div className="card-hover rounded-lg p-8 group">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="section-title text-xl mb-3 group-hover:text-accent transition-colors">No Tech Hassle</h3>
            <p className="text-sm text-muted leading-relaxed">
              We handle hosting, SSL certificates, payment processing, shopping cart, and checkout. 
              You focus on your craft.
            </p>
          </div>
          <div className="card-hover rounded-lg p-8 group">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="section-title text-xl mb-3 group-hover:text-accent transition-colors">Your Shipping, Your Control</h3>
            <p className="text-sm text-muted leading-relaxed">
              Use your own shipping accounts and methods. Set your own policies. 
              Full control over fulfillment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-4 mb-12 animate-fade-in">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">Platform Features</span>
          <h2 className="section-title text-4xl md:text-5xl">Everything you need to sell online</h2>
          <p className="text-xl text-muted max-w-2xl leading-relaxed">A complete e-commerce solution with transparent pricing.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "🎨",
              title: "Branded Storefront",
              description: "Custom subdomain, your logo, your policies. Looks professional from day one.",
            },
            {
              icon: "🔒",
              title: "Secure Payments",
              description: "Stripe-powered checkout. Customers trust it. You receive payouts directly.",
            },
            {
              icon: "💰",
              title: "1% Platform Fee",
              description: "$5 application + $5/month subscription. Plus 1% per sale. Simple and transparent.",
            },
          ].map((item, index) => (
            <div 
              key={item.title} 
              className="card-hover rounded-lg p-8 flex flex-col gap-4 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-14 w-14 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="section-title text-xl group-hover:text-accent transition-colors">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div id="stores">
        <Section
          eyebrow="Featured Stores"
          title="Discover Quality Makers"
          description="Browse products from independent craftsmen and makers."
        >
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card rounded-lg p-6 flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-lg border border-border bg-background/40 flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.3em] muted">Store Preview</span>
              </div>
              <h3 className="section-title text-xl">Dude.Box</h3>
              <p className="text-sm muted">Premium EDC subscription box curated monthly.</p>
              <a
                href="/stores/dudebox"
                className="outline-button rounded-full px-4 py-2 text-xs uppercase tracking-[0.25em] text-center"
              >
                Visit Store
              </a>
            </div>
            {/* Add more featured stores as they join */}
          </div>
        </Section>
      </div>

      <section className="py-16">
        <div className="flex flex-col gap-4 mb-8 text-center animate-fade-in">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">For Makers</span>
          <h2 className="section-title text-4xl md:text-5xl">Ready to sell your products?</h2>
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Join makers who trust Dude.Box to handle their online presence.
          </p>
        </div>
        <div className="card-hover rounded-2xl p-12 max-w-3xl mx-auto text-center border-2 border-accent/20 shadow-card">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="section-title text-3xl mb-4">Start Your Store Today</h3>
          <p className="text-muted mb-8 max-w-lg mx-auto leading-relaxed">
            Apply to become a vendor, get approved, connect your Stripe account, 
            and start selling. It takes less than 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/portal/register"
              className="solid-button rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] inline-block font-bold shadow-button"
            >
              Create Account →
            </a>
            <a
              href="/members/become-vendor"
              className="outline-button rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] inline-block border-2 font-semibold"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </Container>
  );
}
