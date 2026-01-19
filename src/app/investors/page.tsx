import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export default function InvestorsPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="For Investors"
        title="Executive summary"
        description="Business model, operating discipline, and leadership."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Business model">
            Membership revenue only. 200 members at $200/month creates predictable cash flow.
          </Card>
          <Card title="Estimated annual revenue">
            Base membership revenue is $480,000 annually. With add-ons and merchandise, the
            conservative annual estimate is approximately $690,000.
          </Card>
          <Card title="Operating discipline">
            Controlled access, capped capacity, and focused services. Built for stability and
            consistent margins.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Leadership"
        title="Veteran ownership & leadership"
        description="Credible leadership and grounded operations."
      >
        <p className="muted max-w-3xl">
          The leadership team prioritizes accountability, safety, and long-term sustainability.
          The club is structured to meet lender and investor standards.
        </p>
      </Section>

      <Section
        eyebrow="Request Information"
        title="Investor information request"
        description="Submit a request for additional materials."
      >
        <form
          action="/api/investor-request"
          method="post"
          className="grid gap-4 max-w-2xl"
        >
          <label className="text-sm flex flex-col gap-2">
            Full name
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              name="name"
              required
            />
          </label>
          <label className="text-sm flex flex-col gap-2">
            Email
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              type="email"
              name="email"
              required
            />
          </label>
          <label className="text-sm flex flex-col gap-2">
            Organization
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              name="organization"
            />
          </label>
          <label className="text-sm flex flex-col gap-2">
            Message
            <textarea
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              name="message"
              rows={4}
            />
          </label>
          <button
            type="submit"
            className="solid-button rounded px-4 py-3 text-sm uppercase tracking-[0.2em]"
          >
            Request Investor Information
          </button>
          <p className="text-xs muted">
            TODO: Wire to secure email or CRM. No information is sent yet.
          </p>
        </form>
      </Section>
    </Container>
  );
}
