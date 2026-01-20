import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Location | dude.box",
  description:
    "San Diego location focus for dude.box, with emphasis on access, parking, and proximity to base and work corridors.",
};

export default function LocationPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Location</span>
          <h1 className="section-title text-4xl md:text-5xl">
            San Diego focus
          </h1>
          <p className="text-lg muted">
            Target neighborhoods prioritize access, parking, and proximity to base and work.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Target areas"
        title="Neighborhoods under review"
        description="Selected for accessibility and consistent member flow."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Point Loma">
            Central location with strong access to residential and base corridors.
          </Card>
          <Card title="Midway District">
            Mixed-use area with parking options and arterial access.
          </Card>
          <Card title="Miramar">
            Industrial positioning with reliable access and lower congestion.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Access"
        title="Parking and proximity"
        description="Convenient arrival supports routine and retention."
      >
        <p className="text-sm muted max-w-3xl">
          Site selection emphasizes straightforward parking, predictable travel time, and
          proximity to base and work corridors to support daily routines.
        </p>
      </Section>
    </Container>
  );
}
