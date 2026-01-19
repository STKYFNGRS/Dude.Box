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
        description="Membership is capped, structured, and intentionally managed."
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
              <li>Structured check-ins</li>
              <li>Private session requests</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Access"
        title="No public payment"
        description="Membership is approved manually to maintain capacity and standards."
      >
        <p className="muted max-w-3xl">
          Prospective members are assessed on fit, commitment, and alignment with the club’s
          discipline. Applications and payments are not public at this time.
        </p>
      </Section>

      <Section
        eyebrow="FAQ"
        title="Common questions"
        description="Plain answers, no pressure."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Why a 200-member cap?">
            The cap preserves access, privacy, and predictable operations. It protects the
            member experience and keeps the model stable.
          </Card>
          <Card title="Is there a long-term contract?">
            No long-term contracts. Membership is monthly and reviewed for continued fit.
          </Card>
          <Card title="Can I pay online?">
            Not at this time. Membership is handled directly to maintain standards and capacity.
          </Card>
          <Card title="Is the club open to the public?">
            No. Access is limited to approved members and scheduled guests.
          </Card>
        </div>
      </Section>
    </Container>
  );
}
