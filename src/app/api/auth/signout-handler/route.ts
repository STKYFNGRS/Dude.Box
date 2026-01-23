import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the cart association when user signs out
    const cartCookie = cookies().get("dudebox_cart");
    
    if (cartCookie?.value) {
      // Clear buyer identity from cart
      const domain = process.env.SHOPIFY_STORE_DOMAIN;
      const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

      if (domain && token) {
        const mutation = `
          mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
            cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
              cart {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        await fetch(`https://${domain}/api/2024-07/graphql.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
          },
          body: JSON.stringify({
            query: mutation,
            variables: {
              cartId: cartCookie.value,
              buyerIdentity: {
                email: null,
                customerAccessToken: null,
              },
            },
          }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Don't fail signout if cart clear fails
    return NextResponse.json({ success: true });
  }
}
