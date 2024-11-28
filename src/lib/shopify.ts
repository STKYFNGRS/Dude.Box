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

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ 
  query, 
  variables = {} 
}: { 
  query: string; 
  variables?: Record<string, unknown>;
}): Promise<ShopifyFetchResponse> {
  if (!domain || !accessToken) {
    throw new Error('Missing Shopify domain or access token');
  }

  try {
    const endpoint = `https://${domain}/api/2024-01/graphql.json`;
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 900 } // 15 minutes cache
    });

    if (!result.ok) {
      throw new Error(`Shopify API error: ${result.status} ${result.statusText}`);
    }

    const body = await result.json();

    if (body.errors) {
      throw new Error(
        `Shopify API error: ${JSON.stringify(body.errors, null, 2)}`
      );
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('Shopify API error:', error);
    throw error;
  }
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  try {
    const query = `
      query Products {
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              handle
              productType
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
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const query = `
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          title
          description
          handle
          productType
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
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}