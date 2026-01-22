import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "The Box | dude.box",
  description:
    "Subscription-first EDC box featuring veteran-owned brands, built for daily carry.",
};

export default function TheBoxPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">The Box</span>
          <h1 className="section-title text-4xl md:text-5xl">Premium gear, purpose-built.</h1>
          <p className="text-lg muted">
            Each drop is curated from veteran-owned small businesses. Expect durable, field-ready
            tools and grooming essentials with a story behind every maker.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products/subscription-box"
              className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center"
            >
              Subscribe Now
            </Link>
            <Link
              href="/gift"
              className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center border border-accent text-accent hover:text-foreground hover:bg-accent/20 transition"
            >
              Give as a Gift
            </Link>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Subscription"
        title="Pick your cadence"
        description="Monthly by default, with a prepay option for deeper value."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card rounded-lg p-6 flex flex-col gap-4">
            <div className="text-xs uppercase tracking-[0.3em] muted">Monthly</div>
            <h3 className="section-title text-2xl">The Standard Drop</h3>
            <p className="text-sm muted">
              $59.99 per month. New gear every 30 days, pause or skip anytime.
            </p>
            <button className="solid-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em]">
              Start Monthly
            </button>
          </div>
          <div className="card rounded-lg p-6 flex flex-col gap-4">
            <div className="text-xs uppercase tracking-[0.3em] muted">Prepay</div>
            <h3 className="section-title text-2xl">Six-Month Run</h3>
            <p className="text-sm muted">
              Lock in priority access and savings for the next six drops.
            </p>
            <button className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em]">
              Choose Prepay
            </button>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="What’s in the Box"
        title="EDC-grade essentials"
        description="Specs, materials, and utility details for every item."
      >
        <div className="grid gap-4">
          {[
            {
              title: "Lighting & carry",
              content:
                "Pocket-ready illumination, pry tools, and carry hardware rated for everyday use.",
            },
            {
              title: "Steel & utility",
              content:
                "Cutting tools and multitools built with durable steels and field-ready finishes.",
            },
            {
              title: "Grooming & care",
              content:
                "Small-batch soaps, balms, and grooming kits formulated for daily wear.",
            },
          ].map((item) => (
            <details key={item.title} className="card rounded-lg p-5">
              <summary className="section-title text-lg cursor-pointer">{item.title}</summary>
              <p className="text-sm muted pt-3">{item.content}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Meet the Maker"
        title="Stories behind the steel"
        description="Every drop elevates veteran entrepreneurs building real-world gear."
      >
        <div className="card rounded-lg p-6">
          <h3 className="section-title text-2xl mb-3">From service to craftsmanship</h3>
          <p className="text-sm muted">
            Each box spotlights a veteran-owned brand and the story behind their craft. We
            highlight the mission, the materials, and the team so you know exactly who you are
            supporting.
          </p>
        </div>
      </Section>
    </Container>
  );
}
