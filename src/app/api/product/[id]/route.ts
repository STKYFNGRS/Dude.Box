import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    // Check if environment variables are set
    if (!shopifyDomain || !storefrontAccessToken) {
      return NextResponse.json({
        error: `Missing environment variables: ${!shopifyDomain ? 'SHOPIFY_STORE_DOMAIN ' : ''}${!storefrontAccessToken ? 'SHOPIFY_STOREFRONT_ACCESS_TOKEN' : ''}`
      }, { status: 500 });
    }

    // Query to get full product details by ID
    const query = `
      {
        node(id: "${productId}") {
          ... on Product {
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

    // Check if we got the product
    if (!data.data || !data.data.node) {
      return NextResponse.json({
        error: 'Product not found',
      }, { status: 404 });
    }

    return NextResponse.json(data.data.node);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
