import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Concept | dude.box",
  description:
    "The concept behind dude.box: decompression, recovery, and disciplined routines in a calm environment.",
};

export default function ConceptPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Concept</span>
          <h1 className="section-title text-4xl md:text-5xl">
            Decompression, not optimization
          </h1>
          <p className="text-lg muted">
            dude.box exists to create a calm, structured place for men to recover, reset, and
            build steady routines without noise or pressure.
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
            The club is designed for men who want consistent access to recovery and training in a
            stable environment. This is not a performance brand.
          </p>
          <p>
            The goal is simple: protect the experience with discipline, privacy, and calm
            standards that members can count on.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Culture"
        title="No hustle, no alcohol"
        description="A focused space with clear expectations."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">No alcohol on premises.</li>
          <li className="border-b border-border pb-3">Member-only access and controlled capacity.</li>
          <li className="border-b border-border pb-3">Respectful, quiet environment.</li>
          <li className="border-b border-border pb-3">Routine and recovery first.</li>
        </ul>
      </Section>
    </Container>
  );
}
