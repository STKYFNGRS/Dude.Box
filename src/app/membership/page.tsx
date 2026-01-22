import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Subscription | dude.box",
  description:
    "Subscription details for the Dude.box monthly drop and premium veteran-owned gear.",
};

export default function MembershipPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="Subscription"
        title="Subscription overview"
        description="Monthly drops built around premium, veteran-owned gear."
      >
        <p className="text-sm muted max-w-3xl">
          Dude.box delivers curated EDC gear, tools, and grooming essentials on a monthly cadence.
          Each box pairs premium products with the story of the veteran maker behind them.
        </p>
        <p className="text-sm muted max-w-3xl pt-4">
          Subscription is $59.99 per month with flexible pause or skip options.
        </p>
      </Section>

      <Section
        eyebrow="What’s included"
        title="Every drop delivers"
        description="Functional, purpose-driven gear in every box."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">EDC-grade gear and daily-use tools</li>
          <li className="border-b border-border pb-3">Small-batch grooming essentials</li>
          <li className="border-b border-border pb-3">Story cards for every maker</li>
          <li className="border-b border-border pb-3">Limited-run veteran-owned brands</li>
          <li className="border-b border-border pb-3">Priority access to restocks</li>
          <li className="border-b border-border pb-3">Member-only product drops</li>
        </ul>
      </Section>

      <Section
        eyebrow="Flexible options"
        title="Gift-ready upgrades"
        description="Simple options to tailor the experience."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card rounded-lg p-6">
            <h3 className="section-title text-xl mb-2">Gift note</h3>
            <p className="text-sm muted">Add a personal message at checkout.</p>
            <p className="text-sm muted">Included with order fulfillment.</p>
          </div>
          <div className="card rounded-lg p-6">
            <h3 className="section-title text-xl mb-2">Prepay option</h3>
            <p className="text-sm muted">Lock in six months of drops at a preferred rate.</p>
            <p className="text-sm muted">Priority access to limited releases.</p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Quality standard"
        title="Field-tested product curation"
        description="Gear selected for utility and daily carry."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Each drop focuses on practical gear you can carry, wear, or use every day. We avoid
            novelty items and prioritize functional tools.
          </p>
          <p>
            Products are vetted for durability, materials, and real-world performance before
            they earn a place in the box.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Stay in the loop"
        title="Get drop announcements"
        description="Join the list for early access and previews."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Subscribe to get drop previews, maker stories, and early access to limited-run gear.
          </p>
          <p>
            We only share the good stuff—no spam, no fluff.
          </p>
        </div>
        <div className="pt-6 max-w-xl">
          <form action="/api/member-interest" method="post" className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.2em] muted">
              Full name
              <input
                className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                name="name"
                required
              />
            </label>
            <label className="text-xs uppercase tracking-[0.2em] muted">
              Email
              <input
                className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                type="email"
                name="email"
                required
              />
            </label>
            <label className="text-xs uppercase tracking-[0.2em] muted">
              Phone (optional)
              <input
                className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                name="phone"
              />
            </label>
            <button
              type="submit"
              className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] w-full text-center"
            >
              Get Drop Updates
            </button>
            <p className="text-xs muted">
              Form placeholder only. Submissions are not yet processed.
            </p>
          </form>
        </div>
      </Section>
    </Container>
  );
}
