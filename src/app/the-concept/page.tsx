import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export default function ConceptPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="The Concept"
        title="Elevated industrial"
        description="Rugged, sophisticated, and built for daily carry."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Design direction">
            Clean lines, deep contrast, and warm leather accents define the visual tone. It’s
            premium without the cluttered tactical vibe.
          </Card>
          <Card title="Dual-funnel focus">
            The experience speaks to both the end user and the gift buyer, with clear paths for
            subscriptions and gifting.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Brand voice"
        title="Rugged, confident, understated"
        description="No hype. Just functional gear and honest storytelling."
      >
        <p className="muted max-w-3xl">
          dude.box balances toughness with clarity. The message is direct, the details are
          grounded, and the focus stays on quality and mission.
        </p>
      </Section>
    </Container>
  );
}
