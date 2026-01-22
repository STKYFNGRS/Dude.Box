export type ShopProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  image?: string;
  url?: string;
  variantId?: string;
};

const mockProducts: ShopProduct[] = [
  {
    id: "mock-1",
    title: "EDC Field Knife",
    description: "Stonewashed blade, compact sheath, built for daily carry.",
    price: "$84",
    url: undefined,
  },
  {
    id: "mock-2",
    title: "Veteran Soap Co. Kit",
    description: "Small-batch soap and balm set with cedar and leather notes.",
    price: "$32",
    url: undefined,
  },
  {
    id: "mock-3",
    title: "EDC Pocket Light",
    description: "Rechargeable carry light with durable aluminum housing.",
    price: "$48",
    url: undefined,
  },
];

const clampText = (value: string, maxLength = 140) => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1).trim()}…`;
};

const SHOPIFY_API_VERSION = "2024-07";

type StorefrontResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type StorefrontCartLineInput = {
  merchandiseId: string;
  quantity: number;
  attributes?: Array<{ key: string; value: string }>;
};

type StorefrontCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  buyerIdentity?: { email?: string };
  cost?: {
    subtotalAmount?: { amount: string; currencyCode: string };
    totalAmount?: { amount: string; currencyCode: string };
  };
  lines?: {
    nodes: Array<{
      id: string;
      quantity: number;
      merchandise?: {
        id: string;
        title: string;
        product?: { title: string; handle: string };
        image?: { url: string; altText?: string | null };
        price?: { amount: string; currencyCode: string };
      };
    }>;
  };
};

const storefrontFetch = async <T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache; revalidate?: number }
): Promise<T> => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error("Missing Shopify Storefront API configuration.");
  }

  const endpoint = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: options?.cache ?? "no-store",
    next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.status}`);
  }

  const payload = (await response.json()) as StorefrontResponse<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Shopify Storefront API error.");
  }

  if (!payload.data) {
    throw new Error("Shopify Storefront API returned no data.");
  }

  return payload.data;
};

export async function getShopifyProducts(): Promise<ShopProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return mockProducts;
  }

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
          variants(first: 1) {
            nodes {
              id
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
    const data = await storefrontFetch<{ products: { nodes: any[] } }>(query, undefined, {
      revalidate: 300,
    });
    const products = data?.products?.nodes ?? [];

    return products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: clampText(product.description || "Details available upon request."),
      price: `${Number(product.priceRange?.minVariantPrice?.amount ?? 0).toFixed(2)} ${
        product.priceRange?.minVariantPrice?.currencyCode ?? "USD"
      }`,
      image: product.images?.nodes?.[0]?.url,
      url: product.onlineStoreUrl ?? undefined,
      variantId: product.variants?.nodes?.[0]?.id,
    }));
  } catch (error) {
    return mockProducts;
  }
}

export async function cartCreate(input?: {
  lines?: StorefrontCartLineInput[];
  attributes?: Array<{ key: string; value: string }>;
}): Promise<StorefrontCart> {
  const mutation = `
    mutation CartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          buyerIdentity {
            email
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await storefrontFetch<{
    cartCreate: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> };
  }>(mutation, { input });

  const errors = data.cartCreate.userErrors ?? [];
  if (!data.cartCreate.cart || errors.length) {
    throw new Error(errors[0]?.message ?? "Unable to create cart.");
  }

  return data.cartCreate.cart;
}

export async function cartLinesAdd(
  cartId: string,
  lines: StorefrontCartLineInput[]
): Promise<StorefrontCart> {
  const mutation = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          buyerIdentity {
            email
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await storefrontFetch<{
    cartLinesAdd: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> };
  }>(mutation, { cartId, lines });

  const errors = data.cartLinesAdd.userErrors ?? [];
  if (!data.cartLinesAdd.cart || errors.length) {
    throw new Error(errors[0]?.message ?? "Unable to add items to cart.");
  }

  return data.cartLinesAdd.cart;
}

export async function cartBuyerIdentityUpdate(
  cartId: string,
  customerAccessToken: string
): Promise<StorefrontCart> {
  const mutation = `
    mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
          checkoutUrl
          totalQuantity
          buyerIdentity {
            email
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await storefrontFetch<{
    cartBuyerIdentityUpdate: {
      cart: StorefrontCart | null;
      userErrors: Array<{ message: string }>;
    };
  }>(mutation, {
    cartId,
    buyerIdentity: { customerAccessToken },
  });

  const errors = data.cartBuyerIdentityUpdate.userErrors ?? [];
  if (!data.cartBuyerIdentityUpdate.cart || errors.length) {
    throw new Error(errors[0]?.message ?? "Unable to associate customer with cart.");
  }

  return data.cartBuyerIdentityUpdate.cart;
}

export async function getCheckoutUrl(cartId: string): Promise<string> {
  const query = `
    query GetCheckoutUrl($cartId: ID!) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }
  `;

  const data = await storefrontFetch<{ cart: { checkoutUrl: string | null } }>(query, {
    cartId,
  });

  if (!data.cart?.checkoutUrl) {
    throw new Error("Checkout URL not available.");
  }

  return data.cart.checkoutUrl;
}

export async function getCart(cartId: string): Promise<StorefrontCart> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        buyerIdentity {
          email
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await storefrontFetch<{ cart: StorefrontCart | null }>(query, { cartId });

  if (!data.cart) {
    throw new Error("Cart not available.");
  }

  return data.cart;
}
