import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { SubscribeButton } from "@/components/SubscribeButton";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Subscribe | dude.box",
  description:
    "The Dude.box subscription delivers premium, veteran-owned gear with every monthly drop.",
};

const valueProps = [
  {
    title: "Veteran Sourced",
    description: "Every item is sourced from veteran-owned businesses.",
  },
  {
    title: "Keep What You Want",
    description: "Pause, skip, or swap between drops with zero hassle.",
  },
  {
    title: "Cancel Anytime",
    description: "No contracts. Stay for the gear, leave when you want.",
  },
];

const insideDetails = [
  {
    title: "The Night Watch Box",
    content:
      "This month’s theme is built for low-light readiness. Expect pocket illumination (600+ lumens), a CPM-S35VN steel utility blade, anodized aluminum carry hardware, and a waxed canvas kit pouch.",
  },
  {
    title: "Lighting & Carry",
    content:
      "Rechargeable tactical light rated at 600-900 lumens with strobe, IPX7 water resistance, and 2-hour high-output runtime. Includes mil-spec MOLLE-ready carry strap.",
  },
  {
    title: "Steel & Utility",
    content:
      "Compact fixed blade in CPM-S35VN steel, 3.2” edge, stonewashed finish, and Kydex sheath. Add-on pry tool in 420HC steel for daily leverage.",
  },
  {
    title: "Grooming & Care",
    content:
      "Small-batch charcoal beard wash, field balm with cedar + vetiver notes, and a travel-ready canvas dopp kit.",
  },
];

const pastBoxes = [
  {
    title: "The Fieldcraft Box",
    description: "Rugged tools and grooming essentials for daily readiness.",
  },
  {
    title: "The Ironclad Box",
    description: "Hard-use items built for durability and grit.",
  },
  {
    title: "The Ember Box",
    description: "Fire-ready EDC gear and warm-toned leather goods.",
  },
  {
    title: "The Atlas Box",
    description: "Load-bearing gear and precision utility tools.",
  },
];

export default async function SubscriptionBoxPage() {
  // Fetch the monthly subscription product from database
  const product = await prisma.product.findFirst({
    where: {
      interval: "month",
      active: true,
    },
  });

  return (
    <Container className="py-12">
      <section className="pb-16 border-b border-border">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="grid gap-4">
            <div className="card rounded-2xl p-6">
              <div className="aspect-[4/5] rounded-xl border border-border bg-background/40 flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.3em] muted">
                  Product gallery placeholder
                </span>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {["Flat lay", "Lifestyle", "Detail"].map((label) => (
                <div
                  key={label}
                  className="aspect-square rounded-lg border border-border bg-background/40 flex items-center justify-center text-xs uppercase tracking-[0.2em] muted"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="card rounded-2xl p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.35em] muted">Subscribe</span>
              <h1 className="section-title text-4xl md:text-5xl">
                Dude.box Monthly Subscription
              </h1>
              <p className="text-sm muted">
                Premium, veteran-owned gear delivered monthly. Prioritize the subscription
                experience and build your drop cadence.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-xl border border-accent bg-accent/10 p-4">
                <div className="text-xs uppercase tracking-[0.3em] text-accent">
                  Subscription First
                </div>
                <div className="section-title text-2xl">Monthly Drop</div>
                <p className="text-sm muted pt-2">
                  {product ? (
                    <>
                      ${product.price.toString()}/mo. Skip, pause, or cancel anytime.
                    </>
                  ) : (
                    "Loading pricing..."
                  )}
                </p>
                {product && product.stripe_price_id ? (
                  <SubscribeButton
                    priceId={product.stripe_price_id}
                    price={product.price.toString()}
                  />
                ) : (
                  <div className="solid-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] mt-4 w-full text-center opacity-50">
                    Product Setup Required
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <div className="text-xs uppercase tracking-[0.3em] muted">One-time</div>
                <div className="section-title text-xl">Single Box</div>
                <p className="text-sm muted pt-2">
                  Limited inventory available when drops open. Coming soon.
                </p>
                <div className="outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] mt-4 w-full text-center opacity-50">
                  Coming Soon
                </div>
              </div>
            </div>

            <div className="text-xs uppercase tracking-[0.3em] muted">
              Need help?{" "}
              <Link href="/portal/login">Member support</Link>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Value"
        title="Why subscribe"
        description="Built for veterans, designed for the everyday carry mindset."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {valueProps.map((item) => (
            <div key={item.title} className="card rounded-lg p-6 flex flex-col gap-4">
              <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center text-xs uppercase tracking-[0.3em]">
                {item.title.split(" ")[0]}
              </div>
              <h3 className="section-title text-xl">{item.title}</h3>
              <p className="text-sm muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="What's Inside"
        title="The Night Watch drop"
        description="Technical specs and maker details for this month’s box."
      >
        <div className="grid gap-4">
          {insideDetails.map((item) => (
            <details key={item.title} className="card rounded-lg p-5">
              <summary className="section-title text-lg cursor-pointer">{item.title}</summary>
              <p className="text-sm muted pt-3">{item.content}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Past Boxes"
        title="Proof of value"
        description="A look back at the last drops."
      >
        <div className="flex gap-4 overflow-x-auto pb-2">
          {pastBoxes.map((box) => (
            <div
              key={box.title}
              className="card rounded-lg p-6 min-w-[240px] flex flex-col gap-4"
            >
              <div className="aspect-[4/3] rounded-lg border border-border bg-background/40 flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.3em] muted">Box image</span>
              </div>
              <h3 className="section-title text-lg">{box.title}</h3>
              <p className="text-sm muted">{box.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}
