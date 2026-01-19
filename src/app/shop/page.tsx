import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { getShopifyProducts } from "@/lib/shopify";

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
              <h3 className="section-title text-xl">{product.title}</h3>
              <p className="text-sm muted">{product.description}</p>
              <div className="text-sm">{product.price}</div>
              <button className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]">
                View Details
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs muted pt-6">
          TODO: Replace mock data with Shopify Storefront API response.
        </p>
      </Section>
    </Container>
  );
}
