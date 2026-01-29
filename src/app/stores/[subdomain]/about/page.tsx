import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StoreAboutPage({
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
  });

  if (!store) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">About {store.name}</h1>
        <p className="text-muted-foreground">
          Learn more about our story and what we do
        </p>
      </div>

      {/* Store Description */}
      {store.description && (
        <div className="card rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground whitespace-pre-wrap text-lg leading-relaxed">
            {store.description}
          </p>
        </div>
      )}

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card rounded-lg p-6 text-center">
          <div className="text-3xl font-bold mb-2">{store._count.products}</div>
          <div className="text-sm text-muted-foreground">Products</div>
        </div>
        <div className="card rounded-lg p-6 text-center">
          <div className="text-3xl font-bold mb-2">
            {store.owner.first_name || "Maker"}
          </div>
          <div className="text-sm text-muted-foreground">Owner</div>
        </div>
        <div className="card rounded-lg p-6 text-center">
          <div className="text-3xl font-bold mb-2">
            {new Date(store.created_at).getFullYear()}
          </div>
          <div className="text-sm text-muted-foreground">Established</div>
        </div>
      </div>

      {/* Policies */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Policies</h2>
        
        <div className="card rounded-lg p-6">
          <h3 className="font-semibold mb-3">Shipping Policy</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {store.shipping_policy || "No shipping policy provided"}
          </p>
        </div>

        <div className="card rounded-lg p-6">
          <h3 className="font-semibold mb-3">Return Policy</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {store.return_policy || "No return policy provided"}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="card rounded-lg p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p className="text-muted-foreground mb-4">
          Have questions about our products? We'd love to hear from you!
        </p>
        <a
          href={`mailto:${store.contact_email}`}
          className="solid-button rounded-full px-8 py-3 text-sm inline-block"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
