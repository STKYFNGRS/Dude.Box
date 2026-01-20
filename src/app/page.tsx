import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Home | dude.box",
  description:
    "Men’s recovery & social club in San Diego. Member-focused experience for training, recovery, and reset.",
};

export default function HomePage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Home</span>
          <h1 className="section-title text-4xl md:text-5xl">
            Veteran-Owned Men’s Recovery & Social Club
          </h1>
          <p className="text-lg muted">
            A calm, member-focused space to train, recover, unwind, and reset.
          </p>
          <p className="text-sm muted">San Diego, California.</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/membership"
              className="solid-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em] w-full sm:w-auto text-center"
            >
              Explore Membership
            </Link>
            <a
              href="#inside"
              className="outline-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em] w-full sm:w-auto text-center"
            >
              What’s Inside
            </a>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Inside dude.box"
        title="Amenities and daily experience"
        description="Simple, member-first spaces with no public drop-ins."
      >
        <div id="inside" className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Gym",
              description: "Strength and conditioning equipment for consistent training.",
            },
            {
              title: "Sauna",
              description: "Recovery support for stress reduction and sleep quality.",
            },
            {
              title: "Cold plunge",
              description: "Controlled cold therapy for recovery and resilience.",
            },
            {
              title: "Lounge",
              description: "Quiet space to decompress without public traffic.",
            },
            {
              title: "Video games",
              description: "Low-key social downtime and controlled competition.",
            },
            {
              title: "Protein & coffee bar",
              description: "Simple nutrition and caffeine for routine support.",
            },
            {
              title: "Sandwiches & simple food",
              description: "Quick, functional meals for busy schedules.",
            },
            {
              title: "Member-only events",
              description: "Small group gatherings designed for connection.",
            },
          ].map((item) => (
            <div key={item.title} className="card rounded-lg p-6">
              <h3 className="section-title text-xl mb-2">{item.title}</h3>
              <p className="text-sm muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="The Experience"
        title="Member-only, calm, and consistent"
        description="No public drop-ins. No alcohol. Just space to train, recover, and unwind."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Membership is required for access. The space stays uncrowded and predictable, so you
            can build routine without distractions.
          </p>
          <p>
            dude.box is built for men who want to train, recover, and socialize without pressure.
          </p>
        </div>
        <div className="pt-6">
          <Link
            href="/membership"
            className="solid-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em] w-full sm:w-auto text-center"
          >
            View Membership Options
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Capacity"
        title="Limited membership, no urgency"
        description="Designed to stay uncrowded and intentional."
      >
        <p className="text-sm muted max-w-2xl">
          Membership is limited by design to protect the experience. There is no public rush, and
          no pressure language on this site.
        </p>
      </Section>
    </Container>
  );
}
