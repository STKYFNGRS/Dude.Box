import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Investors | dude.box",
  description:
    "Investor overview for dude.box. Recharge club model, recurring revenue, and disciplined operations in San Diego.",
};

export default function InvestorsPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Investors</span>
          <h1 className="section-title text-4xl md:text-5xl">
            Invest in dude.box — predictable revenue, disciplined model, veteran leadership
          </h1>
          <p className="text-lg muted">
            A private men’s recharge club in San Diego with controlled capacity and repeatable
            operations.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="solid-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em] w-full sm:w-auto text-center"
            >
              Request Investor Information
            </a>
          </div>
        </div>
      </section>

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
            The recharge club format keeps service delivery clear and repeatable. Veteran
            leadership prioritizes accountability and operating discipline.
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
            300 members maximum. Capacity is controlled and enforced.
          </Card>
          <Card title="Monthly dues">
            $200 per member. Predictable recurring revenue.
          </Card>
          <Card title="Base revenue">
            $60,000 per month from base dues alone.
          </Card>
          <Card title="Projected revenue">
            $720,000 annually from base dues alone.
          </Card>
        </div>
        <p className="text-sm muted max-w-3xl pt-6">
          Add-on revenue is modeled conservatively using modest adoption rates for the haircut
          package and daily beverage add-on.
        </p>
      </Section>

      <Section
        eyebrow="Why this model works"
        title="Conservative assumptions"
        description="Grounded in recurring revenue and capacity control."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">
            Recurring dues create predictable monthly revenue.
          </li>
          <li className="border-b border-border pb-3">
            Controlled capacity protects service quality and margins.
          </li>
          <li className="border-b border-border pb-3">
            Conservative add-on assumptions reduce revenue risk.
          </li>
          <li className="border-b border-border pb-3">
            Strong profit discipline through planned staffing and utilization.
          </li>
          <li className="border-b border-border pb-3">
            Capital efficiency supported by a focused service model.
          </li>
          <li className="border-b border-border pb-3">
            Add-on assumptions modeled at modest adoption rates for haircuts and daily beverages.
          </li>
        </ul>
      </Section>

      <Section
        eyebrow="Request Information"
        title="Investor information request"
        description="Submit a request for additional materials."
      >
        <form
          id="contact"
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
            Inquiry type
            <select
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              name="inquiryType"
              required
            >
              <option value="">Select an option</option>
              <option value="lender">Bank or SBA lender</option>
              <option value="private-capital">Private capital</option>
              <option value="strategic-partner">Strategic partner</option>
              <option value="other">Other</option>
            </select>
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
