import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { amenities } from "@/lib/constants";

export default function MembershipPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="Membership"
        title="200-member cap. $200/month."
        description="Membership is limited and intentionally managed. No public sign-ups."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="What’s included">
            <ul className="list-disc pl-4 space-y-2">
              {amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
          <Card title="Add-ons">
            <ul className="list-disc pl-4 space-y-2">
              <li>Barber services</li>
              <li>Recovery priority scheduling</li>
              <li>Private session requests</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Access"
        title="No signup flow"
        description="Membership is approved manually to maintain capacity and standards."
      >
        <p className="muted max-w-3xl">
          Prospective members are assessed on fit, commitment, and alignment with the club’s
          discipline. Applications are not public at this time.
        </p>
      </Section>
    </Container>
  );
}
