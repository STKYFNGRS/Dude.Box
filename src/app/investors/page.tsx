import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export default function InvestorsPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="For Investors"
        title="High-impact metrics"
        description="Clear, predictable revenue with disciplined operations."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card title="Member cap">
            200 members maximum. Capacity is controlled and enforced.
          </Card>
          <Card title="Monthly dues">
            $200 per member. Predictable recurring revenue.
          </Card>
          <Card title="Projected revenue">
            Approximately $690,000 per year, including add-ons and merchandise.
          </Card>
          <Card title="Veteran leadership">
            Owner-operated by veterans with disciplined operating standards.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Business Plan"
        title="Download materials"
        description="Business plan and supporting documents."
      >
        <div className="flex flex-wrap gap-4 items-center">
          <a
            href="#"
            className="outline-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em]"
          >
            Download Business Plan (PDF)
          </a>
          <span className="text-xs muted">TODO: Link to the final business plan file.</span>
        </div>
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
