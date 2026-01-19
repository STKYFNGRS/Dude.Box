import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { amenities, membershipBenefits } from "@/lib/constants";

export default function HomePage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Overview</span>
          <h1 className="section-title text-4xl md:text-5xl">
            Veteran-Owned Men’s Recovery & Social Club
          </h1>
          <p className="text-lg muted">
            dude.box is a disciplined, member-capped environment built for recovery, routine,
            and decompression. The experience is structured, private, and intentional.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/investors" className="solid-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em]">
              Investor Overview
            </Link>
            <Link href="/membership" className="outline-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em]">
              Membership Details
            </Link>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Positioning"
        title="What dude.box is / is not"
        description="Clear boundaries keep the brand disciplined and credible."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="What it is">
            A veteran-led club focused on recovery, routine, and calm. A place for men to reset
            without noise, hype, or public spectacle.
          </Card>
          <Card title="What it is not">
            Not a trendy coworking space. Not a social media brand. Not a public drop-in gym.
            Membership is capped and controlled.
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Amenities"
        title="High-level amenities"
        description="Each space supports recovery and steady routine."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          {amenities.map((item) => (
            <li key={item} className="border-b border-border pb-3">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Membership"
        title="Capped membership model"
        description="The club is limited to 200 members at $200/month."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          {membershipBenefits.map((item) => (
            <li key={item} className="border-b border-border pb-3">
              {item}
            </li>
          ))}
        </ul>
        <div className="pt-6">
          <Link href="/membership" className="outline-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em]">
            Read Membership Details
          </Link>
        </div>
      </Section>
    </Container>
  );
}
