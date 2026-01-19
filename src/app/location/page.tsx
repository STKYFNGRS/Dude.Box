import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export default function LocationPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="Location"
        title="San Diego focus"
        description="Target neighborhoods emphasize accessibility and parking."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Point Loma">
            Central to coastal access and established residential pockets.
          </Card>
          <Card title="Midway">
            Strong logistical access and mixed-use potential near major routes.
          </Card>
          <Card title="Miramar">
            Industrial positioning with easy parking and lower congestion.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Access"
        title="Parking and arrival"
        description="Member experience depends on easy access and consistent routine."
      >
        <p className="muted max-w-3xl">
          The club prioritizes direct access, controlled entry, and reliable parking. Location
          selection is based on convenience and long-term operating stability.
        </p>
      </Section>
    </Container>
  );
}
