import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { getShopifyProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop | dude.box",
  description:
    "Shop dude.box merchandise. Clean product grid with neutral branding and understated descriptions.",
};

export default async function ShopPage() {
  const products = await getShopifyProducts();

  return (
    <Container className="py-12">
      <Section
        eyebrow="Shop"
        title="Merchandise"
        description="Minimal merchandising language. Clean product grid."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="card rounded-lg p-6 flex flex-col gap-4">
              <div className="text-xs uppercase tracking-[0.3em] muted">Product</div>
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
                  View Product
                </a>
              ) : (
                <button className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  View Product
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col gap-3 text-xs muted">
          <span>
            Prefer to stay on site? Review{" "}
            <Link href="/membership" className="underline underline-offset-4">
              membership details
            </Link>{" "}
            or{" "}
            <Link href="/investors" className="underline underline-offset-4">
              investor overview
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
