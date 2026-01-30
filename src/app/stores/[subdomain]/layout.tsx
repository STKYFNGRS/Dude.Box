import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/Container";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreCustomStyles } from "@/components/StoreCustomStyles";
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
  
  // Fetch store by subdomain with customization fields
  const store = await prisma.store.findUnique({
    where: {
      subdomain,
      status: "approved", // Only show approved stores
    },
    select: {
      id: true,
      name: true,
      subdomain: true,
      description: true,
      logo_url: true,
      banner_url: true,
      contact_email: true,
      shipping_policy: true,
      return_policy: true,
      custom_colors_enabled: true,
      primary_color: true,
      secondary_color: true,
      background_color: true,
      text_color: true,
      custom_text: true,
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
  const isOwner = !!(session?.user?.email && store.owner.email === session.user.email);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Apply custom colors if enabled */}
      <StoreCustomStyles
        customColorsEnabled={store.custom_colors_enabled || false}
        primaryColor={store.primary_color}
        secondaryColor={store.secondary_color}
        backgroundColor={store.background_color}
        textColor={store.text_color}
      />
      
      {/* Store Header */}
      <StoreHeader 
        store={{
          name: store.name,
          logo_url: store.logo_url
        }}
        basePath={basePath}
        isOwner={isOwner}
      />

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
