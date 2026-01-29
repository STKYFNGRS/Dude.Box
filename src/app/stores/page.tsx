import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    where: {
      status: "approved",
    },
    include: {
      owner: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <Container className="py-12">
      <div className="mb-12 text-center max-w-3xl mx-auto animate-fade-in">
        <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold mb-4 block">
          Our Makers
        </span>
        <h1 className="section-title text-5xl md:text-6xl mb-6 bg-gradient-to-br from-foreground to-muted bg-clip-text text-transparent">
          Browse Stores
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Discover unique products from independent makers and craftsmen who value quality over quantity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store, index) => (
          <a
            key={store.id}
            href={`https://${store.subdomain}.dude.box`}
            className="card-hover rounded-lg p-6 group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="aspect-[4/3] rounded-lg border-2 border-border bg-background/40 mb-4 flex items-center justify-center overflow-hidden group-hover:border-accent transition-all duration-300">
              {store.logo_url || store.banner_url ? (
                <img
                  src={store.logo_url || store.banner_url || ""}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                    <span className="text-xl">🏪</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted font-semibold">
                    {store.name}
                  </span>
                </div>
              )}
            </div>
            
            <h3 className="section-title text-xl mb-2 group-hover:text-accent transition-colors">{store.name}</h3>
            
            {store.description && (
              <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed">
                {store.description}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <span className="text-xs text-muted font-medium">
                {store._count.products} {store._count.products === 1 ? "product" : "products"}
              </span>
              <span className="outline-button rounded-full px-4 py-2 text-xs font-semibold group-hover:border-accent group-hover:text-accent">
                Visit Store →
              </span>
            </div>
          </a>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="card rounded-lg p-16 text-center max-w-2xl mx-auto animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
            <span className="text-4xl">🏪</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground">No Stores Yet</h3>
          <p className="text-muted mb-6 leading-relaxed">
            Be the first maker to join our marketplace! Create your branded storefront and start selling today.
          </p>
          <a
            href="/members/become-vendor"
            className="solid-button rounded-full px-8 py-3 text-sm uppercase tracking-[0.25em] inline-block font-semibold"
          >
            Become a Vendor →
          </a>
        </div>
      )}
    </Container>
  );
}
