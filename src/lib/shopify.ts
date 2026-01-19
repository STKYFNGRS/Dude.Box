export type ShopProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  image?: string;
  url?: string;
};

const mockProducts: ShopProduct[] = [
  {
    id: "mock-1",
    title: "dude.box Crewneck",
    description: "Heavyweight cotton blend, understated branding.",
    price: "$78",
    url: undefined,
  },
  {
    id: "mock-2",
    title: "Recovery Journal",
    description: "Weekly structure, discipline tracking, and notes.",
    price: "$24",
    url: undefined,
  },
  {
    id: "mock-3",
    title: "Membership Patch",
    description: "Leather-backed patch for members and supporters.",
    price: "$18",
    url: undefined,
  },
];

const clampText = (value: string, maxLength = 140) => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1).trim()}…`;
};

export async function getShopifyProducts(): Promise<ShopProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return mockProducts;
  }

  const endpoint = `https://${domain}/api/2024-07/graphql.json`;
  const query = `
    query Products {
      products(first: 8, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          id
          title
          description
          handle
          onlineStoreUrl
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            nodes {
              url
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return mockProducts;
    }

    const payload = await response.json();
    const products = payload?.data?.products?.nodes ?? [];

    return products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: clampText(product.description || "Details available upon request."),
      price: `${Number(product.priceRange?.minVariantPrice?.amount ?? 0).toFixed(2)} ${
        product.priceRange?.minVariantPrice?.currencyCode ?? "USD"
      }`,
      image: product.images?.nodes?.[0]?.url,
      url: product.onlineStoreUrl ?? undefined,
    }));
  } catch (error) {
    return mockProducts;
  }
}
