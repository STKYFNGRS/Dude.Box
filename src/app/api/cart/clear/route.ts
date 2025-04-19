import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { cartId } = await request.json();
    
    // If no cartId is provided, we're just clearing the local cart
    // This is still considered a successful operation
    if (!cartId) {
      return NextResponse.json({ success: true });
    }

    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    // Check if environment variables are set
    if (!shopifyDomain || !storefrontAccessToken) {
      return NextResponse.json({
        error: `Missing environment variables: ${!shopifyDomain ? 'SHOPIFY_STORE_DOMAIN ' : ''}${!storefrontAccessToken ? 'SHOPIFY_STOREFRONT_ACCESS_TOKEN' : ''}`
      }, { status: 500 });
    }

    // There's no direct "clear cart" mutation in Shopify's Storefront API
    // So we'll handle it by creating a new empty cart
    // The frontend will replace the current cart ID with this new one

    const cartCreateMutation = `
      mutation cartCreate {
        cartCreate(input: {}) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Make the GraphQL API call to Shopify
    const response = await fetch(
      `https://${shopifyDomain}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({
          query: cartCreateMutation
        }),
      }
    );

    const data = await response.json();
    
    // Check for errors in the response
    if (data.errors) {
      return NextResponse.json({
        error: data.errors[0].message,
      }, { status: 500 });
    }

    if (data.data?.cartCreate?.userErrors?.length > 0) {
      return NextResponse.json({
        error: data.data.cartCreate.userErrors[0].message,
      }, { status: 400 });
    }

    // Return the new empty cart information
    return NextResponse.json({
      success: true,
      newCartId: data.data?.cartCreate?.cart?.id,
      newCheckoutUrl: data.data?.cartCreate?.cart?.checkoutUrl,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
