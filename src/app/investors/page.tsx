"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/Container";

export default function InvestorsPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("loading");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/investor-request", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit");

      setFormStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error");
    }
  }

  return (
    <Container className="py-12">
      {/* Hero */}
      <section className="pb-16 border-b border-border animate-fade-in">
        <div className="flex flex-col gap-8 max-w-4xl">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Investment Opportunity
          </span>
          <h1 className="section-title text-5xl md:text-7xl leading-tight bg-gradient-to-br from-foreground to-muted bg-clip-text text-transparent">
            Invest in Dude.Box
          </h1>
          <p className="text-2xl text-muted leading-relaxed">
            The low-friction marketplace connecting skilled craftsmen with customers who value quality. 
            We're democratizing e-commerce for independent makers.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="solid-button rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] w-full sm:w-auto text-center font-bold shadow-button"
            >
              Request Investor Deck →
            </a>
            <a
              href="/stores"
              className="outline-button rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] w-full sm:w-auto text-center border-2 font-semibold"
            >
              See Live Platform
            </a>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-8 max-w-4xl">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            The Problem
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            Independent Makers Are Underserved
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            Skilled craftsmen—woodworkers, metalworkers, leather artisans—create exceptional products 
            but lack the technical expertise to build and maintain an online storefront. Existing platforms 
            either charge excessive fees or provide inadequate branding and autonomy.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <div className="card rounded-lg p-8 border-l-4 border-l-error">
            <div className="text-3xl font-bold mb-2 text-error">6.5%</div>
            <div className="text-sm text-foreground font-semibold mb-2">Etsy Transaction Fee</div>
            <p className="text-sm text-muted leading-relaxed">
              Plus 3% payment processing + $0.20 per listing. Makers lose ~10% of every sale.
            </p>
          </div>

          <div className="card rounded-lg p-8 border-l-4 border-l-warning">
            <div className="text-3xl font-bold mb-2 text-warning">$39/mo</div>
            <div className="text-sm text-foreground font-semibold mb-2">Shopify Starting Cost</div>
            <p className="text-sm text-muted leading-relaxed">
              Plus payment processing, apps, themes. Requires technical knowledge to set up and maintain.
            </p>
          </div>

          <div className="card rounded-lg p-8 border-l-4 border-l-info">
            <div className="text-3xl font-bold mb-2 text-info">0</div>
            <div className="text-sm text-foreground font-semibold mb-2">Branded Storefronts</div>
            <p className="text-sm text-muted leading-relaxed">
              Etsy provides listings. Shopify requires coding. Neither offers low-cost branded subdomains.
            </p>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-8 max-w-4xl">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Our Solution
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            The Simplest Path from Craft to Commerce
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            Dude.Box provides makers with a professional, branded storefront at their own subdomain 
            (e.g., <code className="text-accent">johnsworkshop.dude.box</code>) with zero technical 
            setup. Apply, get approved, add products, start selling—all in under 10 minutes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mt-12">
          <div className="card-hover rounded-lg p-8 group">
            <div className="w-14 h-14 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🏪</span>
            </div>
            <h3 className="section-title text-2xl mb-4 group-hover:text-accent transition-colors">
              Branded Storefronts
            </h3>
            <p className="text-muted leading-relaxed mb-4">
              Each maker gets a dedicated subdomain with customizable colors, logo, and product listings. 
              Not a marketplace "listing"—a full store.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Custom subdomain (storename.dude.box)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Personalized branding and colors
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Product management dashboard
              </li>
            </ul>
          </div>

          <div className="card-hover rounded-lg p-8 group">
            <div className="w-14 h-14 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="section-title text-2xl mb-4 group-hover:text-accent transition-colors">
              Zero Technical Setup
            </h3>
            <p className="text-muted leading-relaxed mb-4">
              No coding, no hosting, no payment gateway configuration. Makers connect their Stripe 
              account and start selling immediately.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> One-click Stripe Connect onboarding
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Automatic tax and payment handling
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Mobile-friendly admin dashboard
              </li>
            </ul>
          </div>

          <div className="card-hover rounded-lg p-8 group">
            <div className="w-14 h-14 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="section-title text-2xl mb-4 group-hover:text-accent transition-colors">
              Keep 99% of Sales
            </h3>
            <p className="text-muted leading-relaxed mb-4">
              We charge just 1% per transaction—the lowest in the industry. Payments go directly 
              to makers' bank accounts. We never hold funds.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> 1% platform fee (vs. Etsy's 6.5%)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> $5/month subscription (vs. Shopify's $39)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Direct deposits via Stripe Connect
              </li>
            </ul>
          </div>

          <div className="card-hover rounded-lg p-8 group">
            <div className="w-14 h-14 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="section-title text-2xl mb-4 group-hover:text-accent transition-colors">
              You Ship, We Handle the Rest
            </h3>
            <p className="text-muted leading-relaxed mb-4">
              Makers fulfill orders directly—no inventory pooling, no warehouse logistics. They 
              maintain full control over product quality and customer experience.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Order management dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Automatic customer notifications
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span> Shipping label integrations (optional)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Market Comparison */}
      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-8 max-w-4xl mb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Competitive Analysis
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            How We Compare to Existing Platforms
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-accent">Dude.Box</th>
                <th className="text-center py-4 px-4 font-semibold text-muted">Etsy</th>
                <th className="text-center py-4 px-4 font-semibold text-muted">Shopify</th>
                <th className="text-center py-4 px-4 font-semibold text-muted">Square Online</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-b border-border hover:bg-muted/5">
                <td className="py-4 px-4 font-medium">Transaction Fee</td>
                <td className="py-4 px-4 text-center text-success font-bold">1%</td>
                <td className="py-4 px-4 text-center">6.5%</td>
                <td className="py-4 px-4 text-center">2.9% + 30¢</td>
                <td className="py-4 px-4 text-center">2.9% + 30¢</td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/5">
                <td className="py-4 px-4 font-medium">Monthly Cost</td>
                <td className="py-4 px-4 text-center text-success font-bold">$5</td>
                <td className="py-4 px-4 text-center">$0 (listings $0.20 each)</td>
                <td className="py-4 px-4 text-center">$39+</td>
                <td className="py-4 px-4 text-center">$29+</td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/5">
                <td className="py-4 px-4 font-medium">Setup Time</td>
                <td className="py-4 px-4 text-center text-success font-bold">&lt; 10 min</td>
                <td className="py-4 px-4 text-center">~30 min</td>
                <td className="py-4 px-4 text-center">2-4 hours</td>
                <td className="py-4 px-4 text-center">1-2 hours</td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/5">
                <td className="py-4 px-4 font-medium">Branded Subdomain</td>
                <td className="py-4 px-4 text-center text-success font-bold">✓</td>
                <td className="py-4 px-4 text-center">✗</td>
                <td className="py-4 px-4 text-center">$ (custom domain extra)</td>
                <td className="py-4 px-4 text-center">$ (custom domain extra)</td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/5">
                <td className="py-4 px-4 font-medium">Technical Skills Required</td>
                <td className="py-4 px-4 text-center text-success font-bold">None</td>
                <td className="py-4 px-4 text-center">Minimal</td>
                <td className="py-4 px-4 text-center">Moderate-High</td>
                <td className="py-4 px-4 text-center">Moderate</td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/5">
                <td className="py-4 px-4 font-medium">Brand Control</td>
                <td className="py-4 px-4 text-center text-success font-bold">Full</td>
                <td className="py-4 px-4 text-center">Limited</td>
                <td className="py-4 px-4 text-center">Full</td>
                <td className="py-4 px-4 text-center">Full</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-8 max-w-4xl mb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Revenue Model
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            Dual Revenue Streams with Low Customer Acquisition Cost
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div className="card rounded-lg p-8 bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/20">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Revenue Streams</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-muted text-sm">Transaction Fees (1% of GMV)</span>
                  <span className="text-2xl font-bold text-accent">Variable</span>
                </div>
                <p className="text-xs text-muted">
                  Scales with gross merchandise value. Conservative est: $1K/vendor/month GMV = $10/vendor in fees.
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-muted text-sm">Monthly Subscriptions</span>
                  <span className="text-2xl font-bold text-success">$5/vendor</span>
                </div>
                <p className="text-xs text-muted">
                  Predictable recurring revenue. Pure margin after infrastructure costs (~$0.50/vendor).
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-muted text-sm">Application Fees</span>
                  <span className="text-2xl font-bold text-info">$5 one-time</span>
                </div>
                <p className="text-xs text-muted">
                  Covers onboarding costs and filters non-serious applicants.
                </p>
              </div>
            </div>
          </div>

          <div className="card rounded-lg p-8 bg-gradient-to-br from-info/10 to-transparent border-2 border-info/20">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Cost Structure</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-muted text-sm">Infrastructure (Vercel + NeonDB)</span>
                  <span className="text-lg font-bold text-info">~$0.50/vendor</span>
                </div>
                <p className="text-xs text-muted">
                  Serverless architecture scales automatically. No fixed infrastructure costs.
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-muted text-sm">Payment Processing (Stripe)</span>
                  <span className="text-lg font-bold text-info">Pass-through</span>
                </div>
                <p className="text-xs text-muted">
                  Vendors pay Stripe fees directly (2.9% + 30¢). Not included in our 1%.
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-muted text-sm">Customer Acquisition (CAC)</span>
                  <span className="text-lg font-bold text-info">$15-30</span>
                </div>
                <p className="text-xs text-muted">
                  Organic + paid. Lifetime value (LTV) = 24+ months × $15 = $360+. LTV:CAC &gt; 12:1.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card rounded-lg p-10 bg-gradient-to-br from-success/10 to-transparent border-2 border-success/20">
          <h3 className="text-2xl font-bold mb-8 text-foreground text-center">
            Projected Revenue at Scale
          </h3>
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-sm text-muted uppercase tracking-wider mb-2">100 Vendors</div>
              <div className="text-3xl font-bold text-success mb-1">$1,500</div>
              <div className="text-xs text-muted">MRR (Month 6)</div>
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider mb-2">500 Vendors</div>
              <div className="text-3xl font-bold text-success mb-1">$7,500</div>
              <div className="text-xs text-muted">MRR (Month 12)</div>
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider mb-2">1,000 Vendors</div>
              <div className="text-3xl font-bold text-success mb-1">$15,000</div>
              <div className="text-xs text-muted">MRR (Month 18)</div>
            </div>
            <div>
              <div className="text-sm text-muted uppercase tracking-wider mb-2">2,500 Vendors</div>
              <div className="text-3xl font-bold text-success mb-1">$37,500</div>
              <div className="text-xs text-muted">MRR (Month 24)</div>
            </div>
          </div>
          <p className="text-xs text-muted mt-6 text-center">
            <strong>Subscriptions only.</strong> Transaction fees add ~2x at conservative $1K GMV/vendor/month estimate.
          </p>
        </div>
      </section>

      {/* Market & Growth */}
      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-8 max-w-4xl mb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Market Opportunity
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            $26 Billion TAM, Growing 12% Annually
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            The handmade and artisan goods market in the U.S. is valued at over $26 billion and growing. 
            Etsy alone facilitates $13B in annual GMV with 7.5M active sellers. We're targeting independent 
            makers who want more control and lower fees.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="card rounded-lg p-6 border-l-4 border-l-accent">
            <div className="text-sm text-muted uppercase tracking-wider mb-2">U.S. Artisan Market</div>
            <div className="text-3xl font-bold mb-1 text-foreground">$26B</div>
            <div className="text-xs text-muted">Total addressable market</div>
          </div>

          <div className="card rounded-lg p-6 border-l-4 border-l-success">
            <div className="text-sm text-muted uppercase tracking-wider mb-2">Growth Rate</div>
            <div className="text-3xl font-bold mb-1 text-success">12%</div>
            <div className="text-xs text-muted">Annual CAGR</div>
          </div>

          <div className="card rounded-lg p-6 border-l-4 border-l-info">
            <div className="text-sm text-muted uppercase tracking-wider mb-2">Etsy Sellers</div>
            <div className="text-3xl font-bold mb-1 text-info">7.5M</div>
            <div className="text-xs text-muted">Potential customers</div>
          </div>

          <div className="card rounded-lg p-6 border-l-4 border-l-warning">
            <div className="text-sm text-muted uppercase tracking-wider mb-2">Our Target</div>
            <div className="text-3xl font-bold mb-1 text-warning">0.1%</div>
            <div className="text-xs text-muted">= 7,500 vendors</div>
          </div>
        </div>

        <div className="card rounded-lg p-10 bg-gradient-to-br from-accent/5 to-transparent border border-border">
          <h3 className="text-2xl font-bold mb-8 text-foreground">Growth Strategy</h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center text-lg font-bold text-accent">
                  1
                </div>
                <h4 className="font-bold text-foreground">Pilot Phase</h4>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Launch with 20-50 curated makers. Validate unit economics, iterate on product, 
                gather testimonials. Target: Month 0-3.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center text-lg font-bold text-success">
                  2
                </div>
                <h4 className="font-bold text-foreground">Scale Acquisition</h4>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Launch paid acquisition (Google, Meta, maker forums). Target 100+ vendors by Month 6. 
                Begin affiliate program for early adopters.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-info/10 border-2 border-info/30 flex items-center justify-center text-lg font-bold text-info">
                  3
                </div>
                <h4 className="font-bold text-foreground">Optimize & Expand</h4>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Add premium features (custom domains, advanced analytics). Expand to international 
                markets. Target 1,000+ vendors by Month 18.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Terms */}
      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-8 max-w-4xl mb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Investment Terms
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            Seeking $150K Seed Round
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            We're raising a seed round to fund vendor acquisition, product development, and operational 
            infrastructure for the first 18 months.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div className="card rounded-lg p-8 bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/20">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Use of Funds</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted">Marketing & Acquisition</span>
                <span className="font-bold text-foreground">$75K (50%)</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted">Product Development</span>
                <span className="font-bold text-foreground">$40K (27%)</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted">Operations & Support</span>
                <span className="font-bold text-foreground">$25K (17%)</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted">Legal & Compliance</span>
                <span className="font-bold text-foreground">$10K (6%)</span>
              </div>
            </div>
          </div>

          <div className="card rounded-lg p-8 bg-gradient-to-br from-success/10 to-transparent border-2 border-success/20">
            <h3 className="text-2xl font-bold mb-6 text-foreground">18-Month Milestones</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <div>
                  <div className="font-semibold text-foreground">500 Active Vendors</div>
                  <div className="text-xs text-muted">$7.5K MRR from subscriptions</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <div>
                  <div className="font-semibold text-foreground">$500K Gross GMV</div>
                  <div className="text-xs text-muted">$5K in monthly transaction fees</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <div>
                  <div className="font-semibold text-foreground">Break-Even Operations</div>
                  <div className="text-xs text-muted">MRR covers infrastructure + support</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <div>
                  <div className="font-semibold text-foreground">Validated Unit Economics</div>
                  <div className="text-xs text-muted">LTV:CAC &gt; 10:1, ready for Series A</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card rounded-lg p-10 bg-gradient-to-br from-info/10 to-transparent border-2 border-info/20 text-center">
          <h3 className="text-2xl font-bold mb-4 text-foreground">Investment Structure</h3>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            We're offering equity or convertible note terms. Open to discussing SAFEs, revenue sharing, 
            or other structures that align with investor preferences.
          </p>
          <a
            href="#contact"
            className="solid-button rounded-full px-10 py-4 text-sm uppercase tracking-[0.25em] font-bold shadow-button inline-block"
          >
            Request Full Investor Deck
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16" id="contact">
        <div className="flex flex-col gap-8 max-w-3xl pb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Get in Touch
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            Investor Inquiry
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            Interested in learning more? Request our full investor deck, financial projections, 
            and due diligence materials.
          </p>
        </div>

        {formStatus === "success" ? (
          <div className="card rounded-lg p-8 max-w-2xl bg-success/10 border-2 border-success/20">
            <h3 className="text-xl font-bold mb-2 text-success">Thank You!</h3>
            <p className="text-muted">
              We've received your inquiry and will respond within 48 hours. Check your email for confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2 text-foreground">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                id="name"
                className="input w-full text-base"
                name="name"
                placeholder="John Smith"
                required
                disabled={formStatus === "loading"}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                Email <span className="text-error">*</span>
              </label>
              <input
                id="email"
                className="input w-full text-base"
                type="email"
                name="email"
                placeholder="john@example.com"
                required
                disabled={formStatus === "loading"}
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-semibold mb-2 text-foreground">
                Company / Fund Name
              </label>
              <input
                id="organization"
                className="input w-full text-base"
                name="organization"
                placeholder="Acme Ventures"
                disabled={formStatus === "loading"}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-foreground">
                Phone (Optional)
              </label>
              <input
                id="phone"
                className="input w-full text-base"
                name="phone"
                placeholder="+1 (555) 123-4567"
                disabled={formStatus === "loading"}
              />
            </div>

            <div>
              <label htmlFor="inquiryType" className="block text-sm font-semibold mb-2 text-foreground">
                Inquiry Type <span className="text-error">*</span>
              </label>
              <select
                id="inquiryType"
                className="input w-full text-base"
                name="inquiryType"
                required
                disabled={formStatus === "loading"}
              >
                <option value="">Select an option</option>
                <option value="angel">Angel Investor</option>
                <option value="vc">Venture Capital</option>
                <option value="strategic">Strategic Partner</option>
                <option value="advisor">Advisor / Board Member</option>
                <option value="press">Press / Media</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2 text-foreground">
                Message
              </label>
              <textarea
                id="message"
                className="input w-full text-base"
                name="message"
                rows={5}
                placeholder="Tell us about your interest in Dude.Box..."
                disabled={formStatus === "loading"}
              />
            </div>

            {formStatus === "error" && (
              <div className="card rounded-lg p-4 bg-error/10 border border-error/20 text-sm text-error">
                Failed to submit inquiry. Please try again or email us directly at investors@dude.box
              </div>
            )}

            <button
              type="submit"
              className="solid-button rounded-full px-8 py-3 text-sm uppercase tracking-[0.25em] font-bold shadow-button"
              disabled={formStatus === "loading"}
            >
              {formStatus === "loading" ? "Sending..." : "Submit Inquiry →"}
            </button>

            <p className="text-xs text-muted italic">
              We respond to all serious inquiries within 48 hours. Your information is confidential.
            </p>
          </form>
        )}
      </section>
    </Container>
  );
}
