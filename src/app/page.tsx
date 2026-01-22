import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Home | dude.box",
  description:
    "Premium EDC subscription box sourced from veteran-owned small businesses.",
};

export default function HomePage() {
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
              <Link
                href="https://shop.dude.box/collections/all"
                className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center"
              >
                Start Your Subscription
              </Link>
              <Link
                href="https://shop.dude.box/collections/all"
                className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center border border-accent text-accent hover:text-foreground hover:bg-accent/20 transition"
              >
                Give as a Gift
              </Link>
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

      <Section
        eyebrow="Overflow"
        title="Shop the Overflow"
        description="Shop individual items from past drops while they last."
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
