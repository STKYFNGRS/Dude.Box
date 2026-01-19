import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { amenities } from "@/lib/constants";

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
            eyebrow="Overview"
            title="Membership model"
            description="Membership is capped, reviewed, and intentionally managed."
          >
            <p className="muted max-w-3xl">
              Access is limited to preserve privacy, consistent availability, and operational
              stability. Members are admitted based on fit and commitment to the environment.
            </p>
          </Section>

          <Section
            eyebrow="Benefits"
            title="What members receive"
            description="Short, direct benefits with clear value."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Card title="Recovery & routine">
                <ul className="list-disc pl-4 space-y-2">
                  <li>Daily structure and accountability.</li>
                  <li>Quiet environment for decompression.</li>
                  <li>Access to recovery protocols.</li>
                </ul>
              </Card>
              <Card title="Facilities">
                <ul className="list-disc pl-4 space-y-2">
                  {amenities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </Section>

          <Section
            eyebrow="Add-ons"
            title="Optional services"
            description="Clear add-ons without pressure."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Card title="Barber services">
                Priority booking and regular maintenance without public traffic.
              </Card>
              <Card title="Recovery priority access">
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
                className="solid-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                Express Interest
              </button>
              <p className="text-xs muted">
                TODO: Wire to member intake workflow. No submissions are processed yet.
              </p>
            </form>
          </div>
        </aside>
      </div>
    </Container>
  );
}
