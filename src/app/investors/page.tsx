import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Investors | dude.box",
  description:
    "Investor overview for dude.box. Membership cap, recurring revenue, and disciplined operations in San Diego.",
};

export default function InvestorsPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="Investment Thesis"
        title="Disciplined recurring revenue"
        description="Clear membership economics with controlled capacity."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            dude.box operates a capped membership model that emphasizes stability, predictable
            revenue, and focused operating costs. The club is designed for consistent utilization
            without expansion pressure.
          </p>
          <p>
            Veteran leadership prioritizes accountability, safety, and a controlled experience.
            The model is built for lender and investor review.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Metrics"
        title="Key snapshot"
        description="Core numbers visible at a glance."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card title="Member cap">
            200 members maximum. Capacity is controlled and enforced.
          </Card>
          <Card title="Monthly dues">
            $200 per member. Predictable recurring revenue.
          </Card>
          <Card title="Base revenue">
            $480,000 annually from base dues alone.
          </Card>
          <Card title="Projected revenue">
            Approximately $690,000 per year with add-ons and merchandise.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Runway"
        title="Operating stability"
        description="Conservative cash flow with predictable staffing needs."
      >
        <p className="muted max-w-3xl">
          The capped model supports steady monthly cash flow and controlled overhead. Staffing and
          service delivery are planned around known member volume.
        </p>
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
            Phone (optional)
            <input
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              name="phone"
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
