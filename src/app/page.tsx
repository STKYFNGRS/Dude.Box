import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Home | dude.box",
  description:
    "Private men’s recharge club in San Diego. Train, recover, relax and reset.",
};

export default function HomePage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <h1 className="section-title text-4xl md:text-5xl">
            Private Men’s Recharge Club
          </h1>
          <p className="text-lg muted">
            A place to train, recover, relax and reset.
          </p>
        </div>
      </section>

      <Section
    
        title="What’s Inside"
        description="Overview of core spaces."
      >
        <div id="inside" className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Training floor",
              description: "Gym access for consistent, practical training.",
            },
            {
              title: "Recovery suite",
              description: "Whirlpool, sauna, cold plunge, lockers, and showers.",
            },
            {
              title: "Lounge",
              description: "Man-cave atmosphere with sports viewing, pool table, and limited gaming.",
            },
            {
              title: "Barber services",
              description: "On-site barber with appointment-based service.",
            },
            {
              title: "Coffee, protein, and deli counter",
              description: "Simple, functional fuel built into the routine.",
            },
            {
              title: "Therapist room",
              description: "Scheduled, preventative support in a private setting.",
            },
            {
              title: "Masseuse room",
              description: "Appointment-based massage in a dedicated room.",
            },
          ].map((item) => (
            <div key={item.title} className="card rounded-lg p-6">
              <h3 className="section-title text-xl mb-2">{item.title}</h3>
              <p className="text-sm muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        
        title="Mental health & therapy"
        description="Professional, confidential, and stigma-free."
      >
        <p className="text-sm muted max-w-3xl">
          Members have access to scheduled sessions with an on-site licensed therapist as part of a broader
          focus on preventative support and steady wellbeing. 
        </p>
      </Section>

      <Section
        
        title="Built for men who want routine"
        description="Inclusive, grounded, and consistent."
      >
        <ul className="grid gap-3 md:grid-cols-2 text-sm muted">
          <li className="border-b border-border pb-3">Men looking to improve and unwind</li>
          <li className="border-b border-border pb-3">Men who value routine and consistency</li>
          <li className="border-b border-border pb-3">Professionals, veterans, fathers, tradesmen</li>
          <li className="border-b border-border pb-3">Men who want calm, not chaos</li>
        </ul>
      </Section>

      <Section
        eyebrow="Philosophy"
        title="Routine over intensity"
        description="Calm environments that support long-term improvement."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            The club is built around steady routines instead of intensity or speed. Progress comes
            from consistency, not pressure.
          </p>
          <p>
            The environment is calm by design so members can focus on training, recovery, and
            long-term improvement without noise.
          </p>
        </div>
      </Section>

      

     
    </Container>
  );
}
