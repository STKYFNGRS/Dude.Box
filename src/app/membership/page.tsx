import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Membership | dude.box",
  description:
    "Membership details for dude.box. 200-member cap, $200/month, structured recovery and decompression.",
};

export default function MembershipPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="Membership"
        title="200-member cap. $200/month."
        description="Structured recovery and decompression with controlled access."
      />

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="flex flex-col gap-10">
          <Section
            eyebrow="Why Membership Matters"
            title="Recovery without pressure"
            description="Value first, pricing second."
          >
            <p className="muted max-w-3xl">
              Too many spaces push performance or noise. dude.box is built for routine, recovery,
              and long-term balance. Members have consistent access to calm spaces, training, and
              support without a public crowd.
            </p>
          </Section>

          <Section
            eyebrow="Benefits"
            title="What members receive"
            description="Benefit-led and easy to scan."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Card title="Strength & conditioning equipment">
                Dedicated training space with limited capacity and consistent access.
              </Card>
              <Card title="Sauna & cold plunge">
                Recovery tools that support stress management and reset.
              </Card>
              <Card title="Casual lounge & games">
                Quiet decompression in a member-only environment.
              </Card>
              <Card title="Barber services">
                Optional grooming with scheduled access and privacy.
              </Card>
              <Card title="Preventative therapist access">
                Scheduled, non-crisis support for long-term wellbeing.
              </Card>
              <Card title="Coffee, protein, and simple food">
                Functional fuel to support routine and recovery.
              </Card>
            </div>
          </Section>

          <Section
            eyebrow="Add-ons"
            title="Optional services"
            description="Clear add-ons without pressure."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Card title="Barber package">
                Priority booking and regular maintenance without public traffic.
              </Card>
              <Card title="Recovery priority">
                Higher availability for recovery equipment and sessions.
              </Card>
            </div>
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
              <Card title="How does cancellation work?">
                Membership is monthly. Requests to pause or end are handled directly.
              </Card>
              <Card title="Is there a usage policy?">
                Yes. Members are expected to respect shared spaces and scheduled sessions.
              </Card>
              <Card title="Is the club open to the public?">
                No. Access is limited to approved members and scheduled guests.
              </Card>
            </div>
          </Section>
        </div>

        <aside className="card rounded-lg p-6 sticky top-6">
          <h3 className="section-title text-xl mb-4">Membership highlights</h3>
          <ul className="text-sm muted space-y-2 mb-6">
            <li>200-member maximum</li>
            <li>$200 per month</li>
            <li>San Diego focus</li>
            <li>Veteran-led operations</li>
          </ul>
          <div className="border-t border-border pt-6">
            <h4 className="section-title text-lg mb-3">Membership tier</h4>
            <p className="text-sm muted mb-4">
              $200/month. Capped at 200 members. Pricing follows value and access.
            </p>
            <h4 className="section-title text-lg mb-3">Interest form</h4>
            <form action="/api/member-interest" method="post" className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-[0.2em] muted">
                Full name
                <input
                  className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                  name="name"
                  required
                />
              </label>
              <label className="text-xs uppercase tracking-[0.2em] muted">
                Email
                <input
                  className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                  type="email"
                  name="email"
                  required
                />
              </label>
              <label className="text-xs uppercase tracking-[0.2em] muted">
                Phone (optional)
                <input
                  className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                  name="phone"
                />
              </label>
              <button
                type="submit"
                className="solid-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] w-full text-center"
              >
                Express Membership Interest
              </button>
              <p className="text-xs muted">
                Interest form only. Submissions are not yet processed.
              </p>
            </form>
          </div>
        </aside>
      </div>
    </Container>
  );
}
