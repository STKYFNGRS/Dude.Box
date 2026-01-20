import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Home | dude.box",
  description:
    "Veteran-owned men’s recovery & social club in San Diego. Calm, member-focused environment for recovery and routine.",
};

export default function HomePage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <h1 className="section-title text-4xl md:text-5xl">
            Veteran-Owned Men’s Recovery & Social Club
          </h1>
          <p className="text-lg muted">
            A calm, structured place to recover, reset, and build steady routines.
          </p>
        </div>
      </section>

      <Section
        eyebrow="What’s Inside"
        title="What’s Inside"
        description="A straightforward overview of the core spaces."
      >
        <div id="inside" className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Training space",
              description: "Equipment and space for consistent, practical training.",
            },
            {
              title: "Sauna & cold plunge",
              description: "Dedicated recovery tools for reset and restoration.",
            },
            {
              title: "Lounge & casual games",
              description: "A quiet place to unwind and connect without noise.",
            },
            {
              title: "Barber services",
              description: "Scheduled services integrated into the routine.",
            },
            {
              title: "Coffee, sandwich, and protein counter",
              description: "Simple, functional fuel for daily routines.",
            },
            {
              title: "Member-only events",
              description: "Small gatherings that keep the environment grounded.",
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
        eyebrow="Mental health & therapy"
        title="Scheduled, preventative support"
        description="Professional, confidential, and stigma-free."
      >
        <p className="text-sm muted max-w-3xl">
          Members have access to scheduled sessions with a licensed therapist as part of a broader
          focus on preventative support and steady wellbeing. It is integrated into the space in a
          calm, natural way.
        </p>
      </Section>

      <Section
        eyebrow="Who it’s for"
        title="Built for men who want routine"
        description="Inclusive, grounded, and consistent."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">Men looking to improve and unwind</li>
          <li className="border-b border-border pb-3">Men who value routine and consistency</li>
          <li className="border-b border-border pb-3">Professionals, veterans, fathers, tradesmen</li>
          <li className="border-b border-border pb-3">Men who want calm, not chaos</li>
        </ul>
      </Section>

      <Section
        eyebrow="Philosophy"
        title="Routine over intensity"
        description="Calm environments that support long-term improvement."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            The club is built around steady routines instead of short bursts of effort. Progress
            comes from consistency, not pressure.
          </p>
          <p>
            The environment is calm by design so members can focus on recovery, training, and
            sustained improvement without noise.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Culture"
        title="Respectful, calm, and shared"
        description="A steady environment built on mutual respect."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            The culture is quiet and grounded. Members look out for the space and each other, and
            the environment stays focused on recovery and routine.
          </p>
          <p>
            It is a place to show up consistently, reset, and move forward without pressure or
            noise.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Founder"
        title="Veteran-owned and led"
        description="Values first, ego last."
      >
        <p className="text-sm muted max-w-3xl">
          The founder is a veteran who built dude.box around discipline, consistency, and respect.
          The focus is steady improvement in a relaxed, no-nonsense environment.
        </p>
      </Section>

      <Section
        eyebrow="The Experience"
        title="The Experience"
        description="A place to improve and unwind."
      >
        <p className="text-sm muted max-w-3xl">
          This is a place men return to regularly for recovery, training, and calm connection. It
          is a reset, not an escape.
        </p>
      </Section>
    </Container>
  );
}
