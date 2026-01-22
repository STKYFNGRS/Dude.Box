import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { ProductPurchaseOptions } from "@/components/ProductPurchaseOptions";
import { getShopifyProductByHandle } from "@/lib/shopify";

type ProductPageProps = {
  params: { handle: string };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getShopifyProductByHandle(params.handle);
  if (!product) {
    return { title: "Product | dude.box" };
  }
  return {
    title: `${product.title} | dude.box`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getShopifyProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  const variants = product.variants ?? [];
  const defaultVariantId = product.variantId ?? variants[0]?.id;

  return (
    <Container className="py-12">
      <Section
        eyebrow="Product"
        title={product.title}
        description={product.description}
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="card rounded-2xl p-6">
            <div className="aspect-[4/5] rounded-xl border border-border bg-background/40 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-xs uppercase tracking-[0.3em] muted">
                  Product image
                </span>
              )}
            </div>
          </div>
          <div className="card rounded-2xl p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-[0.3em] muted">Price</div>
              <div className="section-title text-3xl">{product.price}</div>
            </div>
            <p className="text-sm muted">{product.description}</p>
            <div className="flex flex-col gap-3">
              <ProductPurchaseOptions
                variants={variants}
                initialVariantId={defaultVariantId}
              />
              <Link
                href="/shop"
                className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] w-full text-center"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}
