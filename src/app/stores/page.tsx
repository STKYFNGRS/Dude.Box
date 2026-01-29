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
      <div className="mb-8">
        <h1 className="section-title text-4xl mb-4">Browse Stores</h1>
        <p className="text-lg muted">
          Discover unique products from independent makers and craftsmen.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <a
            key={store.id}
            href={`https://${store.subdomain}.dude.box`}
            className="card rounded-lg p-6 hover:border-accent transition-colors"
          >
            <div className="aspect-[4/3] rounded-lg border border-border bg-background/40 mb-4 flex items-center justify-center overflow-hidden">
              {store.banner_url || store.logo_url ? (
                <img
                  src={store.banner_url || store.logo_url || ""}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs uppercase tracking-[0.3em] muted">
                  {store.name}
                </span>
              )}
            </div>
            
            <h3 className="section-title text-xl mb-2">{store.name}</h3>
            
            {store.description && (
              <p className="text-sm muted mb-4 line-clamp-2">
                {store.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{store._count.products} products</span>
              <span className="outline-button rounded-full px-3 py-1">
                Visit Store →
              </span>
            </div>
          </a>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="card rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            No stores available yet. Check back soon!
          </p>
        </div>
      )}
    </Container>
  );
}
