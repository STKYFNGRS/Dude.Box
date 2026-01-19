import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { amenities } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Overview | dude.box",
  description:
    "Veteran-owned men’s recovery & social club in San Diego. Disciplined, member-capped environment for recovery, routine, and decompression.",
};

export default function HomePage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Overview</span>
          <h1 className="section-title text-4xl md:text-5xl">
            Veteran-Owned Men’s Recovery & Social Club
          </h1>
          <p className="text-lg muted">
            A disciplined, member-capped environment built for recovery, routine, and
            decompression.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/membership"
              className="solid-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em]"
            >
              Learn About Membership
            </Link>
            <Link
              href="/investors"
              className="outline-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em]"
            >
              Investor Overview
            </Link>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Purpose"
        title="Why this exists"
        description="A focused environment for men who want structure, not noise."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Most recovery spaces lack routine or long-term accountability. dude.box is designed
            to provide both, without distraction.
          </p>
          <p>
            The club supports men who want consistent access to recovery resources, physical
            training, and a calm social environment.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Positioning"
        title="What it is / what it isn’t"
        description="Clear boundaries keep the model disciplined and credible."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <div className="card rounded-lg p-6">
            <h3 className="section-title text-xl mb-3">What it is</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Veteran-led recovery and routine.</li>
              <li>Member-capped and intentionally managed.</li>
              <li>Quiet, structured, and private.</li>
            </ul>
          </div>
          <div className="card rounded-lg p-6">
            <h3 className="section-title text-xl mb-3">What it isn’t</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Not a public gym or drop-in facility.</li>
              <li>No social media or influencer culture.</li>
              <li>No alcohol-driven environment.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Amenities"
        title="High-level amenities"
        description="Each space supports recovery and steady routine."
      >
        <div className="grid gap-3 grid-cols-2 md:grid-cols-5 text-xs uppercase tracking-[0.25em] text-foreground">
          {["Gym", "Sauna", "Lounge", "Barber", "Therapist"].map((item) => (
            <div key={item} className="border border-border rounded-lg px-3 py-3 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted pt-6">
          {amenities.map((item) => (
            <li key={item} className="border-b border-border pb-3">
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs muted pt-6">
          Veteran-owned. 200-member cap. No alcohol. Controlled access.
        </p>
      </Section>
    </Container>
  );
}
