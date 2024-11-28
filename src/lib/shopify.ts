import { ShopifyProduct } from '@/types/shopify';

interface ShopifyGraphQLResponse {
  data: {
    products?: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
    product?: ShopifyProduct;
  };
}

interface ShopifyFetchResponse {
  status: number;
  body: ShopifyGraphQLResponse;
  error?: string;
}

async function shopifyFetch({ 
  query, 
  variables = {} 
}: { 
  query: string; 
  variables?: Record<string, unknown>;
}): Promise<ShopifyFetchResponse> {
  try {
    const result = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        },
        body: JSON.stringify({ query, variables }),
      }
    );

    const body = await result.json();

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      status: 500,
      body: { data: {} },
      error: 'Error receiving data',
    };
  }
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query Products {
      products(first: 8) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  return response.body.data.products?.edges.map(({ node }) => node) ?? [];
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ 
    query,
    variables: { handle }
  });

  return response.body.data.product ?? null;
}