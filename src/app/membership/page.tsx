import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata: Metadata = {
  title: "Membership | dude.box",
  description:
    "Membership details for dude.box. Private recharge club access, routine, and shared commitment to the space.",
};

export default function MembershipPage() {
  return (
    <Container className="py-12">
      <Section
        eyebrow="Membership"
        title="Membership overview"
        description="Ongoing access, consistency, and shared commitment to the space."
      >
        <p className="text-sm muted max-w-3xl">
          Membership provides ongoing access to the recharge club for men who value routine,
          recovery, and calm. The membership is limited to preserve the experience and keep the
          space consistent for those who rely on it.
        </p>
        <p className="text-sm muted max-w-3xl pt-4">
          Membership is capped at 300 members. Dues are $200 per month.
        </p>
      </Section>

      <Section
        eyebrow="What membership includes"
        title="Included with every membership"
        description="A straightforward inclusion list."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">Access to the training space</li>
          <li className="border-b border-border pb-3">
            Recovery suite (whirlpool, sauna, cold plunge, lockers, showers)
          </li>
          <li className="border-b border-border pb-3">
            Lounge with sports viewing, pool table, and limited gaming stations
          </li>
          <li className="border-b border-border pb-3">Access to the barber (services optional)</li>
          <li className="border-b border-border pb-3">
            Access to the coffee, sandwich, and protein counter
          </li>
          <li className="border-b border-border pb-3">
            Access to the therapist room (scheduled, preventative)
          </li>
          <li className="border-b border-border pb-3">
            Access to the masseuse room (appointment-based)
          </li>
        </ul>
      </Section>

      <Section
        eyebrow="Optional add-ons"
        title="Simple extensions"
        description="Two optional additions to support routine."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card rounded-lg p-6">
            <h3 className="section-title text-xl mb-2">Haircut package</h3>
            <p className="text-sm muted">Includes two haircuts per month.</p>
            <p className="text-sm muted">Appointment-based scheduling.</p>
          </div>
          <div className="card rounded-lg p-6">
            <h3 className="section-title text-xl mb-2">Daily beverage</h3>
            <p className="text-sm muted">One daily drink from the coffee and protein counter.</p>
            <p className="text-sm muted">Designed to support routine and convenience.</p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Membership expectations"
        title="Shared responsibility"
        description="A steady environment depends on consistent use and respect."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Members respect the space, the staff, and each other. The environment stays calm and
            consistent because everyone shares responsibility for it.
          </p>
          <p>
            Membership is designed for regular use, not occasional drop-ins. It works best when
            members return and build routine over time.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Inquiry process"
        title="Begin with an inquiry"
        description="A calm, private first step."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Membership begins with an inquiry. This helps confirm mutual fit, availability, and
            alignment with the culture of the space.
          </p>
          <p>
            If it looks like a good fit, the team will follow up with next steps and timing.
          </p>
        </div>
        <div className="pt-6 max-w-xl">
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
              className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] w-full text-center"
            >
              Request Membership Information
            </button>
            <p className="text-xs muted">
              Inquiry form only. Submissions are not yet processed.
            </p>
          </form>
        </div>
      </Section>
    </Container>
  );
}
