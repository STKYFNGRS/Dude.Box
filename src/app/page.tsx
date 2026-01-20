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
          <span className="text-xs uppercase tracking-[0.35em] muted">Home</span>
          <h1 className="section-title text-4xl md:text-5xl">
            Veteran-Owned Men’s Recovery & Social Club
          </h1>
          <p className="text-lg muted">
            A calm, member-focused space built for recovery, routine, and connection.
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
              description: "Limited-capacity training space focused on routine, not hype.",
            },
            {
              title: "Sauna & cold plunge",
              description: "Recovery tools for stress management and reset.",
            },
            {
              title: "Lounge & casual games",
              description: "Calm, member-only space to unwind and connect.",
            },
            {
              title: "Barber services",
              description: "Scheduled services in a private, controlled setting.",
            },
            {
              title: "Coffee, protein, and simple food",
              description: "Functional fuel that supports daily routine.",
            },
            {
              title: "Member-only events",
              description: "Small group gatherings without public traffic.",
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
          focus on preventative mental wellness, stress management, and life transitions.
        </p>
      </Section>

      <Section
        eyebrow="Who it’s for"
        title="Built for men who want routine"
        description="Not nightlife. Not performance culture."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">Veterans</li>
          <li className="border-b border-border pb-3">Professionals</li>
          <li className="border-b border-border pb-3">Men seeking structure and recovery</li>
          <li className="border-b border-border pb-3">Those who want calm, not crowds</li>
        </ul>
      </Section>

      <Section
        eyebrow="Philosophy"
        title="Routine over intensity"
        description="Quiet structure that supports long-term balance."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            The club is designed for men who want consistent access to recovery and training in a
            stable environment — this isn’t a high-pressure gym.
          </p>
          <p>
            The focus is steady, long-term progress. Discipline, privacy, and calm shape every
            visit so members know what to expect and can rely on the same supportive environment.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Culture"
        title="Calm focus and respect"
        description="Clear expectations for everyone who walks in the door."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">
            Member-only access, limited capacity: A private membership and controlled capacity
            ensure a calm, crowd-free space.
          </li>
          <li className="border-b border-border pb-3">
            Respectful, quiet environment: Courtesy and quiet are maintained at all times so
            everyone can concentrate on their own recovery.
          </li>
          <li className="border-b border-border pb-3">
            Routine and recovery come first: Every aspect of the club puts consistent routines
            and effective recovery before anything else.
          </li>
        </ul>
        <p className="text-sm muted max-w-3xl pt-6">
          Expect a quiet lounge with casual games, a protein and coffee bar, simple sandwiches,
          and access to scheduled sessions with a licensed therapist for preventative support.
        </p>
      </Section>

      <Section
        eyebrow="Founder"
        title="Veteran-owned and led"
        description="Discipline, consistency, and respect."
      >
        <p className="text-sm muted max-w-3xl">
          dude.box is a veteran-owned club. Our founder’s military background instilled values of
          discipline, consistency, and respect — principles at the core of the mission. He
          created dude.box to share those ideals in a relaxed, no-nonsense environment where
          fellow men can decompress and rebuild at their own pace.
        </p>
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
        eyebrow="Capacity & discipline"
        title="200-member cap"
        description="Designed to stay uncrowded and predictable."
      >
        <p className="text-sm muted max-w-2xl">
          Membership is limited by design to protect the experience. The environment stays calm
          and consistent by keeping capacity controlled.
        </p>
      </Section>
    </Container>
  );
}
