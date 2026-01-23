import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { resetToken, customerId, password } = await request.json();

    if (!resetToken || !customerId || !password) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json(
        { error: "Password reset is temporarily unavailable." },
        { status: 503 }
      );
    }

    const mutation = `
      mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
        customerResetByUrl(resetUrl: $resetUrl, password: $password) {
          customer {
            id
            email
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    // Extract numeric ID if full GID was passed
    const numericId = customerId.includes('/') 
      ? customerId.split('/').pop() 
      : customerId;
    
    // Construct the reset URL that Shopify expects
    const resetUrl = `https://${domain}/account/reset/${numericId}/${resetToken}`;

    const response = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          resetUrl,
          password,
        },
      }),
    });

    const result = await response.json();
    const errors = result?.data?.customerResetByUrl?.customerUserErrors ?? [];

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Unable to reset password. Please try again." },
      { status: 500 }
    );
  }
}
