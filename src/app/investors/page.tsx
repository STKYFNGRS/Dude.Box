import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Partners | dude.box",
  description:
    "Partner with dude.box to showcase veteran-owned gear in a premium subscription box.",
};

export default function InvestorsPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Partners</span>
          <h1 className="section-title text-4xl md:text-5xl">
            Partner with dude.box — veteran-made products, purpose-driven audiences
          </h1>
          <p className="text-lg muted">
            We spotlight veteran-owned small businesses through a premium subscription experience
            built for daily carry.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="solid-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em] w-full sm:w-auto text-center"
            >
              Request Partner Info
            </a>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Why partner"
        title="A focused, premium audience"
        description="Reach subscribers who value craftsmanship and purpose."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            We curate gear for men who care about quality, craftsmanship, and story. Each drop is
            positioned as a premium collection rather than a discount bundle.
          </p>
          <p>
            Our model provides recurring exposure for veteran-owned brands in a high-intent
            subscription environment.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="What we look for"
        title="Maker standards"
        description="Products should be functional, durable, and story-forward."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card title="Veteran-owned">
            Founder-led, veteran-owned, or veteran-operated brands.
          </Card>
          <Card title="EDC utility">
            Practical products built for daily carry and repeated use.
          </Card>
          <Card title="Small batch">
            Limited runs that maintain craftsmanship and quality control.
          </Card>
          <Card title="Story-ready">
            A strong maker story we can tell with the product.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="Drop-ready collaboration"
        description="We plan, validate, and spotlight each maker."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">
            Product evaluation and sample testing.
          </li>
          <li className="border-b border-border pb-3">
            Collaborative story capture for the maker profile.
          </li>
          <li className="border-b border-border pb-3">
            Drop planning with volume forecasting.
          </li>
          <li className="border-b border-border pb-3">
            Fulfillment alignment and quality review.
          </li>
          <li className="border-b border-border pb-3">
            Post-drop performance insights.
          </li>
          <li className="border-b border-border pb-3">
            Ongoing maker feature support.
          </li>
        </ul>
      </Section>

      <Section
        eyebrow="Request Information"
        title="Partner inquiry"
        description="Tell us about your brand and production capacity."
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
            Brand name
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
            Partnership type
            <select
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              name="inquiryType"
              required
            >
              <option value="">Select an option</option>
              <option value="maker">Maker / Brand</option>
              <option value="supplier">Supplier / Distributor</option>
              <option value="retail">Retail partner</option>
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
            Submit Partner Request
          </button>
          <p className="text-xs muted">
            TODO: Wire to secure email or CRM. No information is sent yet.
          </p>
        </form>
      </Section>
    </Container>
  );
}
