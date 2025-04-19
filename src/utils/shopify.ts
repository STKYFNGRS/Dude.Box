/**
 * Shopify API utility functions
 * These functions use the Shopify API to fetch product data
 * The API credentials are stored in .env files
 */

// Types for Shopify products
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        originalSrc: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

export interface ShopifyProductResponse {
  data: {
    products?: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
    collection?: {
      products: {
        edges: Array<{
          node: ShopifyProduct;
        }>;
      };
    };
  };
}

/**
 * Fetch all products from Shopify
 */
export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  // Specific collection ID for "A.G.I. Apocalypse" - "gid://shopify/Collection/619752685936"
  const collectionId = "gid://shopify/Collection/619752685936";
  
  const query = `
    {
      collection(id: "${collectionId}") {
        products(first: 50) {
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
              images(first: 5) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    price
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${shopifyDomain}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken as string,
        },
        body: JSON.stringify({ query }),
      }
    );    const jsonResponse = await response.json() as ShopifyProductResponse;
    
    // Check if the response contains collection data
    if (jsonResponse.data && jsonResponse.data.collection && jsonResponse.data.collection.products) {
      return jsonResponse.data.collection.products.edges.map((edge: {node: ShopifyProduct}) => edge.node);
    } else if (jsonResponse.data && jsonResponse.data.products) {
      // Fallback to old format if needed
      return jsonResponse.data.products.edges.map((edge: {node: ShopifyProduct}) => edge.node);
    }
    
    console.error('Unexpected API response format:', jsonResponse);
    return [];
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

/**
 * Fetch a single product by handle
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  const query = `
    {
      productByHandle(handle: "${handle}") {
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
        images(first: 5) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 5) {
          edges {
            node {
              id
              title
              price
              availableForSale
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${shopifyDomain}/api/2023-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken as string,
        },
        body: JSON.stringify({ query }),
      }
    );

    const jsonResponse = await response.json();
    return jsonResponse.data.productByHandle;
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    return null;
  }
}

/**
 * Format price
 */
export function formatPrice(amount: string, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
