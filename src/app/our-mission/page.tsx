import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Our Mission | dude.box",
  description:
    "A veteran circular economy built around durable gear, good stories, and measurable impact.",
};

export default function OurMissionPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Our Mission</span>
          <h1 className="section-title text-4xl md:text-5xl">The veteran circular economy.</h1>
          <p className="text-lg muted">
            We source from veteran-owned small businesses so every box keeps capital, jobs, and
            recognition inside the veteran community.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Why it matters"
        title="Purpose over hype"
        description="A direct pipeline from maker to member."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Veteran-owned sourcing">
            Every partner is veteran-owned or veteran-operated. We choose brands that build
            durable gear and invest in their communities.
          </Card>
          <Card title="Small batch, high intent">
            Limited runs keep quality high and help small teams scale without losing craft.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Impact"
        title="Measured support"
        description="Transparent, repeatable investment in veteran makers."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">Revenue flows directly to veteran makers.</li>
          <li className="border-b border-border pb-3">Subscription predictability supports hiring.</li>
          <li className="border-b border-border pb-3">Stories amplify veteran entrepreneurship.</li>
          <li className="border-b border-border pb-3">Products stay functional, not novelty.</li>
        </ul>
      </Section>
    </Container>
  );
}
