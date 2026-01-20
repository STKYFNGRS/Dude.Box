import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "About | dude.box",
  description:
    "The purpose behind dude.box: decompression, recovery, and disciplined routines in a calm environment.",
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">About</span>
          <h1 className="section-title text-4xl md:text-5xl">Built for reset</h1>
          <p className="text-lg muted">
            dude.box is a calm, structured club for men who want to recover, reset, and build
            steady routines away from daily noise. There’s no push to optimize every moment. The
            focus is real decompression and sustainable balance in body and mind.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Philosophy"
        title="Routine over intensity"
        description="Quiet structure that supports long-term balance."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Routine over intensity. The club is designed for men who want consistent access to
            recovery and training in a stable environment — this isn’t a high-pressure gym.
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
    </Container>
  );
}
