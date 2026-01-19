import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { amenities } from "@/lib/constants";

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
            A disciplined, member-capped environment for recovery and decompression in San Diego.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/membership"
              className="solid-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em]"
            >
              Learn About Membership
            </Link>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Positioning"
        title="What dude.box is / is not"
        description="Clear boundaries keep the model disciplined and credible."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="What it is">
            A veteran-led club focused on recovery, routine, and calm. A place for men to reset
            without noise, hype, or public spectacle.
          </Card>
          <Card title="What it is not">
            Not a trendy coworking space. Not a social media brand. Not a public drop-in gym or
            an open-membership facility.
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
    </Container>
  );
}
