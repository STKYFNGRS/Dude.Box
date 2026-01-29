import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Container } from "@/components/Container";
import Image from "next/image";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const headersList = await headers();
  const hostname = headersList.get("host") || "";
  
  // Determine if accessed via subdomain or main domain path
  const isSubdomainAccess = hostname.startsWith(`${subdomain}.`) && !hostname.startsWith("www.");
  
  // Use root paths for subdomain access, full paths for www.dude.box/stores/subdomain
  const basePath = isSubdomainAccess ? "" : `/stores/${subdomain}`;
  
  // Fetch store by subdomain
  const store = await prisma.store.findUnique({
    where: {
      subdomain,
      status: "approved", // Only show approved stores
    },
    include: {
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
    <div className="min-h-screen flex flex-col">
      {/* Store Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-xl">
        <Container className="py-4">
          <div className="flex items-center justify-between mb-4">
            {store.logo_url ? (
              <Image
                src={store.logo_url}
                alt={store.name}
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            ) : (
              <h1 className="text-2xl font-bold">{store.name}</h1>
            )}
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to Dude.Box
            </Link>
          </div>
          
          {/* Store Navigation */}
          <nav className="flex gap-6">
            <Link
              href={`${basePath}/`}
              className="text-sm hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href={`${basePath}/products`}
              className="text-sm hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href={`${basePath}/about`}
              className="text-sm hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>
        </Container>
      </header>

      {/* Banner (if configured) */}
      {store.banner_url && (
        <div className="w-full h-64 relative">
          <Image
            src={store.banner_url}
            alt={`${store.name} banner`}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Container className="py-8">{children}</Container>
      </main>

      {/* Store Footer */}
      <footer className="border-t border-border bg-background/95">
        <Container className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-2">{store.name}</h3>
              <p className="text-muted-foreground">
                {store.description || "Handcrafted products by makers who care"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Contact</h3>
              <p className="text-muted-foreground">
                Email: <a href={`mailto:${store.contact_email}`} className="hover:text-primary">{store.contact_email}</a>
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground text-center">
            <p>
              Powered by{" "}
              <Link href="/" className="hover:text-primary">
                Dude.Box
              </Link>{" "}
              - A marketplace for makers
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
