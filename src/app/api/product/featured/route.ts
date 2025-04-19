import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    // Check if environment variables are set
    if (!shopifyDomain || !storefrontAccessToken) {
      return NextResponse.json({
        error: `Missing environment variables: ${!shopifyDomain ? 'SHOPIFY_STORE_DOMAIN ' : ''}${!storefrontAccessToken ? 'SHOPIFY_STOREFRONT_ACCESS_TOKEN' : ''}`
      }, { status: 500 });
    }

    // Query to get featured products (first 10 products)
    const query = `
      {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              description
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
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Make the API call to Shopify
    const response = await fetch(
      `https://${shopifyDomain}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    
    // Check for errors in the response
    if (data.errors) {
      return NextResponse.json({
        error: data.errors[0].message,
      }, { status: 500 });
    }
    
    // Check if we got products
    const products = data.data?.products?.edges || [];
    
    return NextResponse.json({
      success: true,
      productCount: products.length,
      sampleProducts: products.map((edge: any) => edge.node),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
