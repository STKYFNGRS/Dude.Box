import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json(
        { error: "Registration is temporarily unavailable." },
        { status: 503 }
      );
    }

    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            email: email.toLowerCase().trim(),
            password,
            firstName,
            lastName,
            acceptsMarketing: false,
          },
        },
      }),
    });

    const result = await response.json();
    const errors = result?.data?.customerCreate?.customerUserErrors ?? [];

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}
