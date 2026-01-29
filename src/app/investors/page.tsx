import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Investors & Partners | Dude.Box",
  description:
    "Invest in the marketplace connecting skilled makers with customers who value quality craftsmanship. Low friction, high value platform for independent craftsmen.",
};

export default function InvestorsPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border animate-fade-in">
        <div className="flex flex-col gap-8 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Investors & Partners
          </span>
          <h1 className="section-title text-5xl md:text-6xl leading-tight bg-gradient-to-br from-foreground to-muted bg-clip-text text-transparent">
            Invest in the Future of Maker Commerce
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            Dude.Box is a low-friction marketplace platform connecting skilled craftsmen with 
            customers who value quality. We provide the technology, they bring the craft.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="solid-button rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] w-full sm:w-auto text-center font-bold shadow-button"
            >
              Request Information →
            </a>
            <a
              href="/stores"
              className="outline-button rounded-full px-8 py-4 text-sm uppercase tracking-[0.25em] w-full sm:w-auto text-center border-2 font-semibold"
            >
              See Our Makers
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl pb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            The Opportunity
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            A Growing Market with Minimal Overhead
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            We've built a platform that removes technical barriers for skilled makers who want 
            to sell online without managing complex infrastructure.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card-hover rounded-lg p-8 border-l-4 border-l-success">
            <div className="text-3xl font-bold mb-2 text-success">1%</div>
            <div className="text-sm text-foreground font-semibold mb-2">Platform Fee</div>
            <p className="text-sm text-muted leading-relaxed">
              Ultra-competitive fee structure. Makers keep 99% of sales. Revenue scales with marketplace growth.
            </p>
          </div>

          <div className="card-hover rounded-lg p-8 border-l-4 border-l-accent">
            <div className="text-3xl font-bold mb-2 text-accent">$5/mo</div>
            <div className="text-sm text-foreground font-semibold mb-2">Recurring Revenue</div>
            <p className="text-sm text-muted leading-relaxed">
              Predictable monthly subscription per vendor. Scales linearly with vendor acquisition.
            </p>
          </div>

          <div className="card-hover rounded-lg p-8 border-l-4 border-l-info">
            <div className="text-3xl font-bold mb-2 text-info">∞</div>
            <div className="text-sm text-foreground font-semibold mb-2">Scalability</div>
            <p className="text-sm text-muted leading-relaxed">
              Serverless infrastructure. Zero marginal cost per new vendor. Built to scale globally.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl pb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Platform Advantages
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            Built for Growth, Designed for Makers
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            Our platform solves real pain points for independent craftsmen while maintaining 
            profitability and scalability.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-hover rounded-lg p-8 group">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="section-title text-xl mb-3 group-hover:text-accent transition-colors">
              Underserved Market
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Thousands of skilled makers lack technical expertise to sell online. Etsy takes 6.5% + fees. 
              We take 1% and give them a branded storefront, not a listing.
            </p>
          </div>

          <div className="card-hover rounded-lg p-8 group">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="section-title text-xl mb-3 group-hover:text-accent transition-colors">
              Instant Onboarding
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Makers go from application to live storefront in under 10 minutes. No coding, 
              no hosting setup, no payment gateway configuration.
            </p>
          </div>

          <div className="card-hover rounded-lg p-8 group">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="section-title text-xl mb-3 group-hover:text-accent transition-colors">
              Direct Payments
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Stripe Connect integration means vendors receive 99% of sales directly to their 
              bank account. We never hold funds. Trust and transparency built-in.
            </p>
          </div>

          <div className="card-hover rounded-lg p-8 group">
            <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="section-title text-xl mb-3 group-hover:text-accent transition-colors">
              Dual Revenue Streams
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              1% transaction fees grow with GMV. $5/month per vendor provides predictable 
              recurring revenue. Both scale independently.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl pb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Growth Metrics
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            Early Traction & Potential
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            Platform is live and operational. Currently onboarding pilot vendors to validate 
            unit economics before scaling acquisition.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="card rounded-lg p-6 border-l-4 border-l-accent">
            <div className="text-sm text-muted uppercase tracking-wider mb-2">Target</div>
            <div className="text-2xl font-bold mb-1 text-foreground">100</div>
            <div className="text-sm text-muted">Vendors in 12 months</div>
          </div>

          <div className="card rounded-lg p-6 border-l-4 border-l-success">
            <div className="text-sm text-muted uppercase tracking-wider mb-2">Revenue Model</div>
            <div className="text-2xl font-bold mb-1 text-success">MRR + GMV</div>
            <div className="text-sm text-muted">Dual income streams</div>
          </div>

          <div className="card rounded-lg p-6 border-l-4 border-l-info">
            <div className="text-sm text-muted uppercase tracking-wider mb-2">Tech Stack</div>
            <div className="text-2xl font-bold mb-1 text-info">Serverless</div>
            <div className="text-sm text-muted">Zero fixed infrastructure</div>
          </div>

          <div className="card rounded-lg p-6 border-l-4 border-l-warning">
            <div className="text-sm text-muted uppercase tracking-wider mb-2">Market</div>
            <div className="text-2xl font-bold mb-1 text-warning">$200B+</div>
            <div className="text-sm text-muted">US e-commerce TAM</div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl pb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Why Invest
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            Platform Economics
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card rounded-lg p-8 bg-gradient-to-br from-success/10 to-transparent border-2 border-success/20">
            <h3 className="text-xl font-bold mb-4 text-foreground">Revenue Model</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <div>
                  <strong className="text-foreground">Transaction Fees:</strong> 1% of GMV (industry-low)
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <div>
                  <strong className="text-foreground">Subscriptions:</strong> $5/month per active vendor
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <div>
                  <strong className="text-foreground">Setup Fees:</strong> $5 one-time per vendor
                </div>
              </li>
            </ul>
          </div>

          <div className="card rounded-lg p-8 bg-gradient-to-br from-info/10 to-transparent border-2 border-info/20">
            <h3 className="text-xl font-bold mb-4 text-foreground">Cost Structure</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <span className="text-info mt-1">→</span>
                <div>
                  <strong className="text-foreground">Infrastructure:</strong> Serverless (Vercel, NeonDB) - scales with usage
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-info mt-1">→</span>
                <div>
                  <strong className="text-foreground">Payment Processing:</strong> Stripe Connect (2.9% + 30¢ industry standard)
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-info mt-1">→</span>
                <div>
                  <strong className="text-foreground">Support:</strong> Vendor self-service reduces overhead
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 card rounded-lg p-8 bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/20">
          <h3 className="text-xl font-bold mb-4 text-foreground">Example at Scale (1,000 Vendors)</h3>
          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div>
              <div className="text-muted mb-1">Monthly Subscriptions</div>
              <div className="text-2xl font-bold text-accent">$5,000</div>
              <div className="text-xs text-muted">1,000 vendors × $5/mo</div>
            </div>
            <div>
              <div className="text-muted mb-1">Transaction Fees (Est.)</div>
              <div className="text-2xl font-bold text-accent">$10,000</div>
              <div className="text-xs text-muted">$1M GMV × 1%</div>
            </div>
            <div>
              <div className="text-muted mb-1">Total Monthly Revenue</div>
              <div className="text-2xl font-bold text-success">$15,000</div>
              <div className="text-xs text-muted">~$180K annual run-rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="flex flex-col gap-6 max-w-3xl pb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            Get Involved
          </span>
          <h2 className="section-title text-4xl md:text-5xl">
            Investor & Partner Inquiry
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            Interested in investing, partnering, or learning more about Dude.Box? 
            Let's discuss how we're building the future of maker commerce.
          </p>
        </div>

        <form
          id="contact"
          action="/api/investor-request"
          method="post"
          className="grid gap-6 max-w-2xl"
        >
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
            >
              <option value="">Select an option</option>
              <option value="investor">Angel Investor / VC</option>
              <option value="strategic">Strategic Partner</option>
              <option value="advisor">Advisor / Consultant</option>
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
            />
          </div>

          <button
            type="submit"
            className="solid-button rounded-full px-8 py-3 text-sm uppercase tracking-[0.25em] font-bold shadow-button"
          >
            Submit Inquiry →
          </button>

          <p className="text-xs text-muted italic">
            We'll respond to all serious inquiries within 48 hours.
          </p>
        </form>
      </section>
    </Container>
  );
}
