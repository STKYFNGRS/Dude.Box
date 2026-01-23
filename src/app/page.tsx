import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { getShopifyProducts } from "@/lib/shopify";
import { ShopProductCard } from "@/components/ShopProductCard";

export const metadata: Metadata = {
  title: "Dude.Box | Veteran-Owned Subscription Box",
  description:
    "Premium EDC subscription box sourced entirely from veteran-owned small businesses. Gear with purpose. Stories with soul.",
};

export default async function HomePage() {
  const products = await getShopifyProducts();
  return (
    <Container className="py-12">
      <section className="pb-16 border-b border-border">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.35em] muted">
              Veteran-owned subscription
            </span>
            <h1 className="section-title text-4xl md:text-6xl">
              Gear with Purpose. Stories with Soul.
            </h1>
            <p className="text-lg muted max-w-2xl">
              The only subscription box sourced entirely from Veteran-Owned Businesses.
              EDC-ready gear, tools, and grooming essentials curated monthly.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#shop"
                className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center"
              >
                Start Your Subscription
              </a>
              <a
                href="#shop"
                className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center border border-accent text-accent hover:text-foreground hover:bg-accent/20 transition"
              >
                Give as a Gift
              </a>
            </div>
          </div>
          <div className="card rounded-2xl p-6">
            <div className="aspect-[4/5] rounded-xl border border-border bg-background/40 flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.3em] muted">
                Flat lay hero placeholder
              </span>
            </div>
            <div className="pt-4 text-sm muted">
              High-fidelity flat lay photography spotlights the month’s drop.
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="py-16 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl pb-12">
          <span className="text-xs uppercase tracking-[0.35em] muted">Our Mission</span>
          <h2 className="section-title text-4xl md:text-5xl">The veteran circular economy.</h2>
          <p className="text-lg muted">
            We source from veteran-owned small businesses so every box keeps capital, jobs, and
            recognition inside the veteran community.
          </p>
        </div>
        <div className="flex flex-col gap-12">
          <div>
            <div className="pb-6">
              <span className="text-xs uppercase tracking-[0.35em] muted">Why it matters</span>
              <h3 className="section-title text-2xl md:text-3xl pt-2">Purpose over hype</h3>
              <p className="text-lg muted pt-2">A direct pipeline from maker to member.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card title="Veteran-owned sourcing">
                Every partner is veteran-owned or veteran-operated. We choose brands that build
                durable gear and invest in their communities.
              </Card>
              <Card title="Small batch, high intent">
                Limited runs keep quality high and help small teams scale without losing craft.
              </Card>
            </div>
          </div>
          <div>
            <div className="pb-6">
              <span className="text-xs uppercase tracking-[0.35em] muted">Impact</span>
              <h3 className="section-title text-2xl md:text-3xl pt-2">Measured support</h3>
              <p className="text-lg muted pt-2">Transparent, repeatable investment in veteran makers.</p>
            </div>
            <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
              <li className="border-b border-border pb-3">Revenue flows directly to veteran makers.</li>
              <li className="border-b border-border pb-3">Subscription predictability supports hiring.</li>
              <li className="border-b border-border pb-3">Stories amplify veteran entrepreneurship.</li>
              <li className="border-b border-border pb-3">Products stay functional, not novelty.</li>
            </ul>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Sourcing"
        title="Veteran circular economy"
        description="Every box supports veterans building durable, daily-use products."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Veteran Owned",
              description: "Every partner brand is veteran-led or veteran-employed.",
            },
            {
              title: "Small Batch",
              description: "Limited runs keep quality high and drops meaningful.",
            },
            {
              title: "EDC Ready",
              description: "Functional, carry-ready tools built for everyday use.",
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

      <div id="shop">
        <Section
          eyebrow="Shop"
          title="Veteran-made essentials"
          description="Subscription boxes and individual items from veteran-owned makers."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      </div>

      <Section
        eyebrow="Past Drops"
        title="Individual Items"
        description="Shop overflow items from previous months while supplies last."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "The Night Watch Box",
              description: "Low-light EDC gear curated for late-shift carry.",
            },
            {
              title: "The Fieldcraft Box",
              description: "Rugged tools and grooming essentials for daily readiness.",
            },
            {
              title: "The Ironclad Box",
              description: "Hard-use items built for durability and grit.",
            },
          ].map((item) => (
            <div key={item.title} className="card rounded-lg p-6 flex flex-col gap-4">
              <div className="aspect-[4/3] rounded-lg border border-border bg-background/40 flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.3em] muted">Flat lay placeholder</span>
              </div>
              <h3 className="section-title text-xl">{item.title}</h3>
              <p className="text-sm muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}
