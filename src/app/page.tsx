import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Dude.Box | Marketplace for Makers",
  description:
    "A marketplace where skilled craftsmen sell quality products. Get your own storefront, connect your payment account, and reach customers who value craftsmanship.",
};

export default async function HomePage() {
  // Redirect logged-in users to dashboard
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    redirect("/members");
  }

  return (
    <Container className="py-12">
      <section className="pb-16 border-b border-border">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.35em] muted">
              Marketplace for Makers
            </span>
            <h1 className="section-title text-4xl md:text-6xl">
              Sell Your Craft. We Handle the Tech.
            </h1>
            <p className="text-lg muted max-w-2xl">
              A platform where skilled makers can create branded storefronts, connect their payment accounts, 
              and sell quality products - without managing the tech stack.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/members/become-vendor"
                className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center"
              >
                Become a Vendor
              </a>
              <a
                href="/stores/dudebox"
                className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center border border-accent text-accent hover:text-foreground hover:bg-accent/20 transition"
              >
                Browse Stores
              </a>
            </div>
          </div>
          <div className="card rounded-2xl p-6">
            <div className="aspect-[4/5] rounded-xl border border-border bg-background/40 flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] muted">
                Storefront preview
              </span>
            </div>
            <div className="pt-4 text-sm muted">
              Your own branded storefront at yourstore.dude.box
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="py-16 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl pb-12">
          <span className="text-xs uppercase tracking-[0.35em] muted">The Platform</span>
          <h2 className="section-title text-4xl md:text-5xl">Built for makers who want to focus on making.</h2>
          <p className="text-lg muted">
            You create quality products. We provide the storefront, payment processing, 
            hosting, and customer support. Keep 90% of every sale.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Your Own Storefront">
            Get a custom subdomain (yourstore.dude.box), branded pages, and email address. 
            Your brand, your products, your way.
          </Card>
          <Card title="Direct Payments">
            Connect your Stripe account and receive payouts in 2 days. 
            We never hold your funds. You keep 90% of each sale.
          </Card>
          <Card title="No Tech Hassle">
            We handle hosting, SSL certificates, payment processing, shopping cart, and checkout. 
            You focus on your craft.
          </Card>
          <Card title="Your Shipping, Your Control">
            Use your own shipping accounts and methods. Set your own policies. 
            Full control over fulfillment.
          </Card>
        </div>
      </section>

      <Section
        eyebrow="Platform Features"
        title="Everything you need to sell online"
        description="A complete e-commerce solution with no monthly fees."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Branded Storefront",
              description: "Custom subdomain, your logo, your policies. Looks professional from day one.",
            },
            {
              title: "Secure Payments",
              description: "Stripe-powered checkout. Customers trust it. You receive payouts directly.",
            },
            {
              title: "10% Platform Fee",
              description: "Only charged on sales. No upfront costs, no monthly fees. Simple and fair.",
            },
          ].map((item) => (
            <div key={item.title} className="card rounded-lg p-6 flex flex-col gap-4">
              <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center text-xs uppercase tracking-[0.3em]">
                {item.title.split(" ")[0]}
              </div>
              <h3 className="section-title text-xl">{item.title}</h3>
              <p className="text-sm muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

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

      <Section
        eyebrow="For Makers"
        title="Ready to sell your products?"
        description="Join makers who trust Dude.Box to handle their online presence."
      >
        <div className="card rounded-lg p-8 max-w-2xl mx-auto text-center">
          <h3 className="section-title text-2xl mb-4">Start Your Store Today</h3>
          <p className="text-sm muted mb-6">
            Apply to become a vendor, get approved, connect your Stripe account, 
            and start selling. It takes less than 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/portal/register"
              className="solid-button rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] inline-block"
            >
              Create Account
            </a>
            <a
              href="/members/become-vendor"
              className="outline-button rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] inline-block"
            >
              Learn More
            </a>
          </div>
        </div>
      </Section>
    </Container>
  );
}
