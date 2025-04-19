import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    // Check if environment variables are set
    if (!shopifyDomain || !storefrontAccessToken) {
      return NextResponse.json({
        error: `Missing environment variables: ${!shopifyDomain ? 'SHOPIFY_STORE_DOMAIN ' : ''}${!storefrontAccessToken ? 'SHOPIFY_STOREFRONT_ACCESS_TOKEN' : ''}`
      }, { status: 500 });
    }

    // Create a cart on Shopify with the provided items
    const cartCreateMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
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

    // Format the line items for Shopify
    const lines = items.map(item => ({
      quantity: item.quantity,
      merchandiseId: item.variantId
    }));

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
          query: cartCreateMutation,
          variables: {
            input: {
              lines: lines
            }
          }
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

    // Return the checkout URL
    return NextResponse.json({
      success: true,
      checkoutUrl: data.data?.cartCreate?.cart?.checkoutUrl,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
