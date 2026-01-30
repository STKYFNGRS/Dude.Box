import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ subdomain: string; productId: string }>;
}) {
  const { subdomain, productId } = await params;
  const headersList = await headers();
  const hostname = headersList.get("host") || "";
  
  const isSubdomainAccess = hostname.startsWith(`${subdomain}.`) && !hostname.startsWith("www.");
  const basePath = isSubdomainAccess ? "" : `/stores/${subdomain}`;
  
  const store = await prisma.store.findUnique({
    where: {
      subdomain,
      status: "approved",
    },
  });

  if (!store) {
    notFound();
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      active: true,
      store_id: store.id,
      has_pending_changes: false, // Only show if no pending changes
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link
        href={`${basePath}/products`}
        className="text-sm text-primary hover:underline inline-block"
      >
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-border/50 rounded-lg flex items-center justify-center relative overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-9xl">📦</span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="text-3xl font-bold mb-4">
              ${product.price.toString()}
              {product.interval === "month" && (
                <span className="text-lg text-muted-foreground"> /month</span>
              )}
            </div>
          </div>

          {product.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Add to Cart / Purchase */}
          <div className="card rounded-lg p-6">
            <h3 className="font-semibold mb-4">Purchase This Product</h3>
            <AddToCartButton productId={product.id} productName={product.name} />
          </div>

          {/* Store Info */}
          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold mb-2">Sold by</h3>
            <Link
              href={`${basePath}/`}
              className="text-primary hover:underline"
            >
              {store.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Contact: {store.contact_email}
            </p>
          </div>
        </div>
      </div>

      {/* Shipping & Returns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {store.shipping_policy && (
          <div className="card rounded-lg p-6">
            <h3 className="font-semibold mb-3">Shipping Policy</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {store.shipping_policy}
            </p>
          </div>
        )}
        {store.return_policy && (
          <div className="card rounded-lg p-6">
            <h3 className="font-semibold mb-3">Return Policy</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {store.return_policy}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
