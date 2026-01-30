import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function StorePage({
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
        take: 6,
        orderBy: { created_at: "desc" },
      },
      owner: {
        select: {
          first_name: true,
          last_name: true,
          profile_image_url: true,
        },
      },
    },
    // Include custom_text for display
    select: {
      id: true,
      subdomain: true,
      name: true,
      description: true,
      maker_bio: true,
      custom_text: true,
      products: {
        where: { active: true },
        take: 6,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          interval: true,
          image_url: true,
        },
      },
      owner: {
        select: {
          first_name: true,
          last_name: true,
          profile_image_url: true,
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
        {/* Custom welcome message from vendor */}
        {store.custom_text && (
          <div className="mt-6 p-6 card rounded-lg">
            <p className="text-base text-foreground whitespace-pre-wrap italic">
              "{store.custom_text}"
            </p>
          </div>
        )}
      </div>

      {/* About the Maker - Moved Above Products */}
      <div className="card rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">About the Maker</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          {store.owner.profile_image_url && (
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <Image
                src={store.owner.profile_image_url}
                alt={store.owner.first_name || "Maker"}
                width={128}
                height={128}
                className="rounded-full object-cover w-24 h-24 md:w-32 md:h-32"
              />
            </div>
          )}
          
          {/* Bio Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">
              {store.owner.first_name} {store.owner.last_name}
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {store.maker_bio || 
                  `${store.owner.first_name || "A maker"} crafts unique products with care and attention to detail. Each item is made to order and ships directly from their workshop.`}
              </p>
            </div>
            <Link
              href={`${basePath}/about`}
              className="inline-block mt-4 text-sm text-primary hover:underline"
            >
              Learn More →
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {store.products.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link
              href={`${basePath}/products`}
              className="text-sm text-primary hover:underline"
            >
              View All Products →
            </Link>
          </div>
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
                    <span className="text-4xl">📦</span>
                  )}
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
    </div>
  );
}
