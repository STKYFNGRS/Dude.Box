import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export default function ConceptPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="The Concept"
        title="Recovery, routine, decompression"
        description="A calm and disciplined setting built for men who want structure."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Philosophy">
            The club focuses on consistent routine, physical recovery, and clear expectations.
            Members use the space to reset and build forward momentum.
          </Card>
          <Card title="Why this exists">
            Many men need a stable environment without noise or pressure. dude.box is designed
            to be private, intentional, and grounded in veteran leadership.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Discipline"
        title="No hustle language"
        description="This is not a performance brand. It is a place to recover."
      >
        <p className="muted max-w-3xl">
          The tone is calm, direct, and credible. The experience is designed for steady habits
          and long-term health, not attention or trends.
        </p>
      </Section>
    </Container>
  );
}
