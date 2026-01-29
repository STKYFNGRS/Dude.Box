import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Container } from "@/components/Container";
import { StoreFooter } from "@/components/StoreFooter";
import Image from "next/image";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// Generate metadata for store pages including favicon
export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  
  const store = await prisma.store.findUnique({
    where: {
      subdomain,
      status: "approved",
    },
    select: {
      name: true,
      description: true,
    },
  });

  if (!store) {
    return {
      title: "Store Not Found | Dude.Box",
    };
  }

  return {
    title: `${store.name} | Dude.Box`,
    description: store.description || `Shop handcrafted products from ${store.name} on Dude.Box marketplace`,
    icons: {
      icon: [
        { url: 'https://www.dude.box/favicon.svg', type: 'image/svg+xml' },
        { url: 'https://www.dude.box/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: 'https://www.dude.box/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: 'https://www.dude.box/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: 'https://www.dude.box/site.webmanifest',
  };
}

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
  
  // Check if current user is the store owner
  const session = await getServerSession(authOptions);
  
  // Fetch store by subdomain
  const store = await prisma.store.findUnique({
    where: {
      subdomain,
      status: "approved", // Only show approved stores
    },
    include: {
      owner: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
    },
  });

  if (!store) {
    notFound();
  }
  
  // Check if authenticated user is the store owner by comparing emails
  const isOwner = session?.user?.email && store.owner.email === session.user.email;

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
            <div className="flex items-center gap-4">
              {isOwner && (
                <Link
                  href="https://www.dude.box/members"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Dashboard →
                </Link>
              )}
              <Link
                href="https://www.dude.box"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Dude.Box
              </Link>
            </div>
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
      <StoreFooter 
        store={{
          name: store.name,
          description: store.description,
          contact_email: store.contact_email,
          shipping_policy: store.shipping_policy,
          return_policy: store.return_policy,
        }}
        basePath={basePath}
      />
    </div>
  );
}
