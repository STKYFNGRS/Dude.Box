import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "About | dude.box",
  description:
    "Purpose and philosophy for dude.box, a veteran-owned men’s recovery & social club in San Diego.",
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">About</span>
          <h1 className="section-title text-4xl md:text-5xl">
            Why dude.box exists
          </h1>
          <p className="text-lg muted">
            dude.box is a veteran-owned men’s recovery & social club built for routine, calm,
            and steady forward momentum.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Purpose"
        title="A place built for reset"
        description="Clear expectations, quiet focus, and consistent access."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Many men want structure without noise. dude.box creates a focused environment for
            recovery, training, and decompression without public traffic.
          </p>
          <p>
            The goal is simple: protect the member experience while supporting long-term health,
            discipline, and community.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Values"
        title="Calm, discipline, and respect"
        description="Built for men who take recovery seriously."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">
            Quiet, member-only access with consistent standards.
          </li>
          <li className="border-b border-border pb-3">
            Accountability and routine without pressure or hype.
          </li>
          <li className="border-b border-border pb-3">
            Respect for privacy, safety, and personal boundaries.
          </li>
          <li className="border-b border-border pb-3">
            Focused programming that supports long-term stability.
          </li>
        </ul>
      </Section>

      <Section
        eyebrow="Leadership"
        title="Veteran-owned and led"
        description="Leadership built on accountability and service."
      >
        <p className="text-sm muted max-w-3xl">
          The club is owned and operated by veterans who understand structure, consistency, and
          the importance of a controlled environment. The focus is on long-term member wellbeing,
          not public spectacle.
        </p>
      </Section>
    </Container>
  );
}
