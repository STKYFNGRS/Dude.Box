import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function StoreProductsPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const headersList = await headers();
  const hostname = headersList.get("host") || "";
  
  const isSubdomainAccess = hostname.startsWith(`${subdomain}.`) && !hostname.startsWith("www.");
  const basePath = isSubdomainAccess ? "" : `/stores/${subdomain}`;
  
  const store = await prisma.store.findUnique({
    where: {
      subdomain,
      status: "approved",
    },
    include: {
      products: {
        where: { active: true },
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!store) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-muted-foreground">
          Browse all products from {store.name}
        </p>
      </div>

      {store.products.length === 0 ? (
        <div className="card rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">No Products Available</h2>
          <p className="text-muted-foreground">
            This store hasn't added any products yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.products.map((product) => (
            <Link
              key={product.id}
              href={`${basePath}/products/${product.id}`}
              className="card rounded-lg overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="aspect-square bg-border/50 flex items-center justify-center relative overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-6xl">📦</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    ${product.price.toString()}
                  </div>
                  {product.interval === "month" && (
                    <span className="text-xs text-muted-foreground">/month</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
