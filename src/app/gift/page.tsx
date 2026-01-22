import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Gift | dude.box",
  description:
    "Gift a premium subscription box sourced from veteran-owned small businesses.",
};

export default function GiftPage() {
  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Gift</span>
          <h1 className="section-title text-4xl md:text-5xl">Give gear with purpose.</h1>
          <p className="text-lg muted">
            The easiest way to gift premium, veteran-sourced gear. Build a moment that feels
            personal, rugged, and thoughtful.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center"
            >
              Gift a Subscription
            </Link>
            <Link
              href="/the-box"
              className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center border border-accent text-accent hover:text-foreground hover:bg-accent/20 transition"
            >
              See The Box
            </Link>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Gift Options"
        title="Add a personal note"
        description="Gift notes are captured for fulfillment and included with the order."
      >
        <form className="card rounded-lg p-6 flex flex-col gap-4">
          <label className="flex items-center gap-3 text-sm uppercase tracking-[0.2em]">
            <input
              type="checkbox"
              name="attributes[giftOption]"
              className="peer h-4 w-4 accent-accent"
            />
            This is a gift
          </label>
          <div className="hidden peer-checked:flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] muted">
              Gift note
              <textarea
                name="attributes[giftNote]"
                rows={4}
                placeholder="Happy anniversary. Love, Mary."
                className="mt-2 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              />
            </label>
            <span className="text-xs muted">
              Captured as a cart attribute for order fulfillment.
            </span>
          </div>
        </form>
      </Section>

      <Section
        eyebrow="Why it lands"
        title="A story-forward unboxing"
        description="More than gear. It’s a narrative they can carry."
      >
        <div className="grid gap-6 md:grid-cols-2 text-sm muted">
          <p>
            Every box includes the story of the veteran maker, the purpose behind the product,
            and a curated layout that feels premium the moment it’s opened.
          </p>
          <p>
            The result is a gift that feels personal and meaningful, not generic or tactical.
          </p>
        </div>
      </Section>
    </Container>
  );
}
