import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StorePage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  
  const store = await prisma.store.findUnique({
    where: {
      subdomain,
      status: "approved",
    },
    include: {
      products: {
        where: { active: true },
        take: 6,
        orderBy: { created_at: "desc" },
      },
      owner: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!store) {
    notFound();
  }

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to {store.name}</h1>
        {store.description && (
          <p className="text-lg text-muted-foreground">{store.description}</p>
        )}
      </div>

      {/* Featured Products */}
      {store.products.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link
              href={`/stores/${subdomain}/products`}
              className="text-sm text-primary hover:underline"
            >
              View All Products →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.products.map((product) => (
              <Link
                key={product.id}
                href={`/stores/${subdomain}/products/${product.id}`}
                className="card rounded-lg overflow-hidden hover:border-primary/50 transition-colors group"
              >
                <div className="aspect-square bg-border/50 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="text-lg font-bold">
                    ${product.price.toString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {store.products.length === 0 && (
        <div className="card rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">No Products Yet</h2>
          <p className="text-muted-foreground">
            This store is just getting started. Check back soon for new products!
          </p>
        </div>
      )}

      {/* About Section */}
      <div className="card rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">About the Maker</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">
            {store.owner.first_name || "A maker"} crafts unique products with
            care and attention to detail. Each item is made to order and ships
            directly from their workshop.
          </p>
        </div>
        <Link
          href={`/stores/${subdomain}/about`}
          className="inline-block mt-4 text-sm text-primary hover:underline"
        >
          Learn More →
        </Link>
      </div>
    </div>
  );
}
