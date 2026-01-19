export type ShopProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  image?: string;
};

const mockProducts: ShopProduct[] = [
  {
    id: "mock-1",
    title: "dude.box Crewneck",
    description: "Heavyweight cotton blend, understated branding.",
    price: "$78",
  },
  {
    id: "mock-2",
    title: "Recovery Journal",
    description: "Weekly structure, discipline tracking, and notes.",
    price: "$24",
  },
  {
    id: "mock-3",
    title: "Membership Patch",
    description: "Leather-backed patch for members and supporters.",
    price: "$18",
  },
];

export async function getShopifyProducts(): Promise<ShopProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return mockProducts;
  }

  // TODO: Replace with real Storefront API query and mapping.
  return mockProducts;
}
