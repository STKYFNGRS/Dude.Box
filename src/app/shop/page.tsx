import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { getShopifyProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "The Store | dude.box",
  description:
    "Shop premium veteran-owned gear and accessories in the Dude.box store.",
};

export default async function ShopPage() {
  const products = await getShopifyProducts();

  return (
    <Container className="py-12">
      <section className="pb-12 border-b border-border">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.35em] muted">Shop</span>
          <h1 className="section-title text-4xl md:text-5xl">Limited gear, ready to ship.</h1>
          <p className="text-lg muted">
            Shop individual items from veteran-owned makers or start the subscription for monthly
            drops.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products/subscription-box"
              className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center"
            >
              Subscribe Monthly
            </Link>
            <Link
              href="/gift"
              className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full sm:w-auto text-center border border-accent text-accent hover:text-foreground hover:bg-accent/20 transition"
            >
              Gift Options
            </Link>
          </div>
        </div>
      </section>
      <Section
        eyebrow="Shop"
        title="Veteran-made essentials"
        description="Functional gear, tools, and accessories with purpose."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="card rounded-lg p-6 flex flex-col gap-4">
              <div className="text-xs uppercase tracking-[0.3em] muted">Limited drop</div>
              {product.image ? (
                <div className="border border-border rounded overflow-hidden bg-background">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <h3 className="section-title text-xl">{product.title}</h3>
              <p className="text-sm muted">{product.description}</p>
              <div className="text-sm">{product.price}</div>
              {product.url ? (
                <a
                  href={product.url}
                  className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] text-center"
                >
                  View Details
                </a>
              ) : (
                <button className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col gap-3 text-xs muted">
          <span>
            Built for daily carry, small batch drops, and maker storytelling.
          </span>
          <span>
            Prefer a monthly drop? Review{" "}
            <Link href="/products/subscription-box" className="underline underline-offset-4">
              the subscription
            </Link>{" "}
            or{" "}
            <Link href="/gift" className="underline underline-offset-4">
              gift options
            </Link>
            .
          </span>
          <span>
            TODO: Add internal product pages or add-to-cart behavior once Storefront handles are
            wired.
          </span>
        </div>
      </Section>
    </Container>
  );
}
